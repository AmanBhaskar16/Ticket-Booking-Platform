import Show from "../models/show.model.js";
import Theatre from "../models/theatre.model.js";
import Movie from "../models/movie.model.js";
import Booking from "../models/bookings.model.js";
import { redisClient } from "../config/redis.js";
import { pricedFields } from "./show.service.js";
import { notifyBookingsOpen } from "./notification.service.js";
import { invalidateMovieListCache, invalidateMovie } from "./cache.service.js";

// Keeps a rolling week of showtimes on every theatre that has `autoSchedule` on, and
// prunes old auto-created shows nobody booked — so the collection stays roughly the
// same size forever instead of growing week after week.
//
// A screen-day that already has any show (manual or auto) is left alone, so owners can
// still hand-schedule a screen and the scheduler just fills the gaps around them.

const DAY_MS = 24 * 3600_000;
const IST_OFFSET_MS = 330 * 60_000;          // India has no DST, so a fixed offset is exact
const DAYS_AHEAD = 8;                        // today + 7 — the booking pages show a 7-day strip
const FIRST_SHOW_MIN = 9 * 60;               // 9:00 AM IST
const LAST_START_MIN = 23 * 60 + 15;         // no show starts after 11:15 PM IST
const CLEANUP_MIN = 20;                      // turnaround between shows on one screen
const SLOT_MIN = 15;                         // start times snap to quarter hours
const MIN_LEAD_MS = 30 * 60_000;             // don't create a show that starts within 30 min
const KEEP_PAST_DAYS = 2;                    // unbooked auto shows are deleted after this
const LEGACY_SEATS = 80;                     // screens without a layout use the 8×10 map
const LOCK_KEY = "lock:auto-schedule";

const BASE_PRICE = { "2D": 200, "3D": 250, "IMAX": 450, "4DX": 550, "Dolby Atmos": 300 };
const CITY_LANGUAGE = {
    chennai: "Tamil", coimbatore: "Tamil", madurai: "Tamil",
    hyderabad: "Telugu", vijayawada: "Telugu", visakhapatnam: "Telugu",
    bengaluru: "Kannada", bangalore: "Kannada", mysuru: "Kannada",
    kochi: "Malayalam", thiruvananthapuram: "Malayalam", kozhikode: "Malayalam",
    kolkata: "Bengali", pune: "Marathi", mumbai: "Marathi",
};
const DIMENSIONAL = new Set(["Sci-Fi", "Animation", "Fantasy", "Adventure"]);

// ── Time helpers (IST) ────────────────────────────────────
/** UTC instant of IST midnight for the IST calendar day containing `date`, shifted by `addDays` */
const istDayStart = (date, addDays = 0) => {
    const ist = new Date(date.getTime() + IST_OFFSET_MS);
    return Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + addDays) - IST_OFFSET_MS;
};
const istDayKey = (ms) => new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
const roundUpToSlot = (min) => Math.ceil(min / SLOT_MIN) * SLOT_MIN;

// Small seeded PRNG so a given theatre/screen/day always gets the same line-up
function rngFor(seedText) {
    let h = 2166136261;
    for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
    return () => {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}

// ── Programming choices ───────────────────────────────────
/** Fresh releases get more shows; old catalogue titles still get the odd slot */
const recencyWeight = (movie, dayStart) => {
    const age = (dayStart - new Date(movie.releaseDate).getTime()) / DAY_MS;
    if (age < -0.5) return 0;                // not out yet on this day (release dates are stored at UTC midnight)
    if (age <= 30) return 5;
    if (age <= 120) return 3;
    if (age <= 365) return 2;
    return 1;
};

function pickMovie(pool, rng, avoidId) {
    const choices = pool.length > 1 ? pool.filter((p) => p.movie._id.toString() !== avoidId) : pool;
    const total = choices.reduce((a, p) => a + p.weight, 0);
    let r = rng() * total;
    for (const p of choices) if ((r -= p.weight) < 0) return p.movie;
    return choices[choices.length - 1].movie;
}

function formatFor(screen, movie, rng) {
    const text = `${screen.name} ${screen.projection ?? ""} ${screen.sound ?? ""}`.toLowerCase();
    if (text.includes("imax")) return "IMAX";
    if (text.includes("4dx")) return "4DX";
    if (text.includes("atmos")) return "Dolby Atmos";
    return movie.genre?.some((g) => DIMENSIONAL.has(g)) && rng() < 0.4 ? "3D" : "2D";
}

function languageFor(movie, city, rng) {
    const langs = movie.languages?.length ? movie.languages : ["Hindi"];
    const local = CITY_LANGUAGE[String(city ?? "").trim().toLowerCase()];
    const roll = rng();
    // Hollywood plays mostly in English, with some dubbed shows
    if (langs[0] === "English") {
        if (local && langs.includes(local) && roll < 0.2) return local;
        return langs.includes("Hindi") && roll > 0.7 ? "Hindi" : "English";
    }
    if (local && langs.includes(local) && roll < 0.6) return local;
    if (langs.includes("Hindi") && roll > 0.5) return "Hindi";
    return langs[0];
}

const playableOn = (movie, dayStart) =>
    movie && movie.isActive && movie.releaseStatus !== "BANNED" && recencyWeight(movie, dayStart) > 0;

// ── One screen, one day ───────────────────────────────────
function planScreenDay({ theatre, screen, screenIndex, dayStart, movies, now }) {
    const rng = rngFor(`${theatre._id}|${screen.name}|${istDayKey(dayStart)}`);
    const pool = movies
        .filter((m) => playableOn(m, dayStart))
        .map((movie) => ({ movie, weight: recencyWeight(movie, dayStart) }));
    if (!pool.length) return [];

    const shows = [];
    let lastId = null;
    // Stagger screens so the lobby isn't flooded at the same minute
    let startMin = FIRST_SHOW_MIN + (screenIndex * SLOT_MIN) % 60;
    while (startMin <= LAST_START_MIN) {
        const movie = pickMovie(pool, rng, lastId);
        lastId = movie._id.toString();
        const showTime = new Date(dayStart + startMin * 60_000);
        startMin = roundUpToSlot(startMin + (movie.duration || 150) + CLEANUP_MIN);
        if (showTime.getTime() < now.getTime() + MIN_LEAD_MS) continue;

        const format = formatFor(screen, movie, rng);
        const tags = [];
        if (screen.layout?.accessible?.length) tags.push("Wheelchair Accessible");
        if (movie.certificate === "U" && showTime.getTime() - dayStart < 14 * 3600_000) tags.push("Kids");

        shows.push({
            theatreId: theatre._id,
            movieId: movie._id,
            screen: screen.name,
            showTime,
            noOfSeats: LEGACY_SEATS,
            format,
            language: languageFor(movie, theatre.city, rng),
            tags,
            bookedSeats: [],
            isActive: true,
            autoGenerated: true,
            ...pricedFields({ theatre, movie, screen: screen.name, showTime, price: BASE_PRICE[format] }),
        });
    }
    return shows;
}

// Theatres created before screens existed only have a screen count
const screensOf = (theatre) => theatre.screens?.length
    ? theatre.screens
    : Array.from({ length: theatre.totalScreens || 1 }, (_, i) => ({ name: `Screen ${i + 1}` }));

// ── Public API ────────────────────────────────────────────
/** Flip COMING_SOON titles whose release date has arrived */
export const releaseDueMoviesService = async (now = new Date()) => {
    const due = await Movie.find({ releaseStatus: "COMING_SOON", releaseDate: { $lte: now } }).select("_id");
    if (!due.length) return 0;
    await Movie.updateMany({ _id: { $in: due.map((m) => m._id) } }, { releaseStatus: "RELEASED" });
    await Promise.all(due.map((m) => invalidateMovie(m._id).catch(() => {})));
    await invalidateMovieListCache().catch(() => {});
    return due.length;
};

/** Fill every empty screen-day in the next DAYS_AHEAD days. Returns the number of shows created. */
export const scheduleUpcomingShowsService = async (now = new Date()) => {
    const windowStart = istDayStart(now);
    const windowEnd = istDayStart(now, DAYS_AHEAD);

    const theatres = await Theatre.find({ isActive: true, autoSchedule: { $ne: false } })
        .populate("movies", "name duration releaseDate releaseStatus isActive languages genre certificate");

    const docs = [];
    for (const theatre of theatres) {
        const movies = (theatre.movies ?? []).filter(Boolean);
        if (!movies.length) continue;

        const existing = await Show.find({
            theatreId: theatre._id, isActive: true,
            showTime: { $gte: new Date(windowStart), $lt: new Date(windowEnd) },
        }).select("screen showTime").lean();
        const busy = new Set(existing.map((s) => `${s.screen.trim().toLowerCase()}|${istDayKey(s.showTime.getTime())}`));

        screensOf(theatre).forEach((screen, screenIndex) => {
            for (let d = 0; d < DAYS_AHEAD; d++) {
                const dayStart = istDayStart(now, d);
                if (busy.has(`${screen.name.trim().toLowerCase()}|${istDayKey(dayStart)}`)) continue;
                docs.push(...planScreenDay({ theatre, screen, screenIndex, dayStart, movies, now }));
            }
        });
    }
    if (!docs.length) return 0;

    // Movies about to get their first upcoming show — their watchers hear "bookings open"
    const movieIds = [...new Set(docs.map((d) => d.movieId.toString()))];
    const alreadyOpen = new Set((await Show.distinct("movieId", {
        movieId: { $in: movieIds }, isActive: true, showTime: { $gte: now },
    })).map(String));

    await Show.insertMany(docs, { ordered: false });

    await Promise.allSettled(movieIds.filter((m) => !alreadyOpen.has(m)).map((id) => {
        const first = docs.filter((d) => d.movieId.toString() === id).sort((a, b) => a.showTime - b.showTime)[0];
        return notifyBookingsOpen({ movieId: first.movieId, showTime: first.showTime }).catch(console.error);
    }));
    return docs.length;
};

/** Delete auto-created shows that ended KEEP_PAST_DAYS ago and were never booked */
export const pruneOldShowsService = async (now = new Date()) => {
    const cutoff = new Date(now.getTime() - KEEP_PAST_DAYS * DAY_MS);
    const BATCH = 1000;
    let removed = 0;
    let after = null;
    for (;;) {
        const query = { autoGenerated: true, showTime: { $lt: cutoff }, bookedSeats: { $size: 0 } };
        if (after) query._id = { $gt: after };
        const ids = (await Show.find(query).select("_id").sort({ _id: 1 }).limit(BATCH).lean()).map((s) => s._id);
        if (!ids.length) break;
        after = ids[ids.length - 1];
        // Cancelled/expired bookings still point at their show — keep those for history
        const referenced = new Set((await Booking.distinct("showId", { showId: { $in: ids } })).map(String));
        const deletable = ids.filter((id) => !referenced.has(id.toString()));
        if (deletable.length) removed += (await Show.deleteMany({ _id: { $in: deletable } })).deletedCount;
        if (ids.length < BATCH) break;
    }
    return removed;
};

/** release → schedule → prune, guarded so only one server instance runs it at a time */
export const runAutoScheduler = async (now = new Date()) => {
    const locked = redisClient.isReady
        ? await redisClient.set(LOCK_KEY, String(process.pid), { NX: true, EX: 600 })
        : "OK";
    if (!locked) return null;
    try {
        const released = await releaseDueMoviesService(now);
        const created = await scheduleUpcomingShowsService(now);
        const pruned = await pruneOldShowsService(now);
        return { released, created, pruned };
    } finally {
        if (redisClient.isReady) await redisClient.del(LOCK_KEY).catch(() => {});
    }
};
