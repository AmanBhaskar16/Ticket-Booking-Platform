// Fills the database with a realistic catalogue: movies, cinemas across India, audience
// accounts, movie & theatre reviews, and a week of showtimes.
//
//   npm run seed
//
// Safe to run again: movies are matched by name, cinemas by name + city, people by
// email, reviews by (movie|theatre, user). Anything that already exists is left as is,
// so edits made through the dashboard are never overwritten.
import "dotenv/config";   // before config/redis.js reads REDIS_URL
import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import { connectRedis, pubClient, subClient, redisClient } from "../config/redis.js";
import Movie from "../models/movie.model.js";
import Theatre from "../models/theatre.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import TheatreReview from "../models/theatreReview.model.js";
import { updateMovieRating } from "../services/review.service.js";
import { refreshRating } from "../services/theatreReview.service.js";
import { runAutoScheduler } from "../services/autoSchedule.service.js";
import { invalidateMovieListCache, invalidateMovie } from "../services/cache.service.js";
import { USER_ROLE, USER_STATUS } from "../utils/constants.js";
import { MOVIES, EXISTING_SCORES, BANNER_FRAME, bannerFromTrailer } from "./data/movies.js";
import { THEATRES, OWNERS, buildScreens, buildMenu } from "./data/theatres.js";
import { PEOPLE, emailFor } from "./data/people.js";
import { MOVIE_OPENERS, GENRE_LINES, THEATRE_COMMENTS } from "./data/reviewText.js";


const DAY_MS = 24 * 3600_000;
const NOW = new Date();

// ── Deterministic randomness: re-running the seed produces the same data ──
function rng(seedText) {
    let h = 2166136261;
    for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
    return () => {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
}
const pick = (r, list) => list[Math.floor(r() * list.length)];
const sample = (r, list, n) => [...list].sort(() => r() - 0.5).slice(0, n);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const gaussian = (r) => (r() + r() + r() + r() - 2) * Math.sqrt(3);   // ≈ N(0, 1)
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const randomPassword = () => bcrypt.hash(crypto.randomBytes(18).toString("base64"), 10);

// ── People ────────────────────────────────────────────────
async function upsertUsers(list, role) {
    const users = [];
    for (const { name, email } of list) {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.collection.insertOne({
                name, email, password: await randomPassword(), phone: "", avatar: "",
                isEmailVerified: true, userRole: role, userStatus: USER_STATUS.approved,
                walletBalance: 0, watchlist: [], notifyMovies: [], primeTrialUsed: false,
                createdAt: NOW, updatedAt: NOW, __v: 0,
            }).then((r) => ({ _id: r.insertedId, name, email }));
        }
        users.push(user);
    }
    return users;
}

// ── Movies ────────────────────────────────────────────────
async function upsertMovies() {
    let created = 0;
    for (const { score: _score, ...data } of MOVIES) {
        const exists = await Movie.exists({ name: { $regex: `^${escapeRegex(data.name)}$`, $options: "i" } });
        if (exists) continue;
        await Movie.create({
            releaseStatus: "RELEASED", ...data, releaseDate: new Date(data.releaseDate), isActive: true,
            bannerUrl: bannerFromTrailer(data.trailerUrl, BANNER_FRAME[data.name]),
        });
        created++;
    }
    return created;
}

// A portrait poster can't fill the hero, so give every banner-less movie a wide still
async function fillMissingBanners() {
    const bare = await Movie.find({ $or: [{ bannerUrl: "" }, { bannerUrl: null }, { bannerUrl: { $exists: false } }] }).select("name trailerUrl");
    let filled = 0;
    for (const m of bare) {
        const bannerUrl = bannerFromTrailer(m.trailerUrl, BANNER_FRAME[m.name]);
        if (!bannerUrl) continue;
        await Movie.updateOne({ _id: m._id }, { bannerUrl });
        await invalidateMovie(m._id).catch(() => {});
        filled++;
    }
    return filled;
}

// What each kind of cinema programmes, beyond the current releases everyone plays
const REGION_LANGUAGE = { karnataka: "Kannada", telugu: "Telugu", tamil: "Tamil", malayalam: "Malayalam" };

function programmeFor(spec, catalogue) {
    const r = rng(`programme|${spec.name}`);
    const recentCutoff = NOW.getTime() - 540 * DAY_MS;
    const local = REGION_LANGUAGE[spec.region];
    const released = catalogue.filter((m) => m.releaseStatus === "RELEASED");

    const current = released.filter((m) => m.releaseDate.getTime() >= recentCutoff);
    const comingSoon = catalogue.filter((m) => m.releaseStatus === "COMING_SOON");
    const regional = local ? released.filter((m) => m.languages[0] === local) : [];
    const older = released.filter((m) => !current.includes(m) && !regional.includes(m));
    const classics = sample(r, older, local ? 3 : 5);   // re-releases / long runners

    return [...new Map([...current, ...regional, ...classics, ...comingSoon].map((m) => [m._id.toString(), m])).values()];
}

async function upsertTheatres(owners, catalogue) {
    const ownerByChain = Object.fromEntries(OWNERS.map((o, i) => [o.chain, owners[i]._id]));
    const theatres = [];
    let created = 0;
    for (const spec of THEATRES) {
        const { factor, region, chain, screens, ...fields } = spec;
        let theatre = await Theatre.findOne({ name: spec.name, city: spec.city });
        if (!theatre) {
            const built = buildScreens(screens, factor);
            theatre = await Theatre.create({
                ...fields,
                owner: ownerByChain[chain],
                movies: programmeFor(spec, catalogue).map((m) => m._id),
                screens: built,
                totalScreens: built.length,
                menu: buildMenu(factor),
                images: [],
                autoSchedule: true,
            });
            created++;
        }
        theatres.push({ theatre, chain });
    }
    return { theatres, created };
}

// Cinemas that were already in the database get the current releases too
async function refreshExistingProgrammes(catalogue, seededIds) {
    const others = await Theatre.find({ _id: { $nin: seededIds }, isActive: true });
    for (const t of others) {
        const programme = programmeFor({ name: t.name, region: "north" }, catalogue).map((m) => m._id);
        await Theatre.updateOne({ _id: t._id }, { $addToSet: { movies: { $each: programme } } });
    }
    return others.length;
}

// ── Reviews ───────────────────────────────────────────────
function movieComment(r, movie, rating) {
    const band = rating >= 9 ? "rave" : rating >= 7 ? "good" : rating >= 5 ? "mixed" : "poor";
    let text = pick(r, MOVIE_OPENERS[band]).replaceAll("{m}", movie.name);
    const genreLines = (movie.genre ?? []).flatMap((g) => GENRE_LINES[g] ?? []);
    if (band !== "poor" && genreLines.length && r() < 0.7) text += " " + pick(r, genreLines);
    return text;
}

async function seedMovieReviews(catalogue, people) {
    const scores = { ...EXISTING_SCORES, ...Object.fromEntries(MOVIES.map((m) => [m.name, m.score])) };
    const ops = [];
    const touched = [];
    for (const movie of catalogue) {
        const score = scores[movie.name];
        if (!score || movie.releaseStatus !== "RELEASED" || !movie.isActive) continue;
        touched.push(movie._id);
        const r = rng(`reviews|${movie.name}`);
        const reviewers = sample(r, people, 8 + Math.floor(r() * 15));
        const from = Math.max(movie.releaseDate.getTime(), NOW.getTime() - 120 * DAY_MS);
        for (const person of reviewers) {
            const rating = clamp(Math.round(score + gaussian(r) * 1.2), 1, 10);
            const createdAt = new Date(from + r() * (NOW.getTime() - from));
            ops.push({
                updateOne: {
                    filter: { movieId: movie._id, userId: person._id },
                    update: { $setOnInsert: {
                        movieId: movie._id, userId: person._id, rating,
                        comment: movieComment(r, movie, rating),
                        likes: sample(r, people, Math.floor(r() * 9)).map((p) => p._id),
                        createdAt, updatedAt: createdAt, __v: 0,
                    } },
                    upsert: true,
                },
            });
        }
    }
    const res = ops.length ? await Review.collection.bulkWrite(ops, { ordered: false }) : { upsertedCount: 0 };
    for (const id of touched) await updateMovieRating(id);
    return res.upsertedCount;
}

const CHAIN_QUALITY = { luxe: 4.5, galaxy: 4.2, regal: 4.0, starlight: 3.8 };

async function seedTheatreReviews(theatres, people) {
    const ops = [];
    for (const { theatre, chain } of theatres) {
        const r = rng(`theatre-reviews|${theatre.name}`);
        const base = CHAIN_QUALITY[chain] ?? 4;
        for (const person of sample(r, people, 6 + Math.floor(r() * 10))) {
            const rating = clamp(Math.round(base + gaussian(r) * 0.7), 2, 5);
            const aspect = () => clamp(Math.round(rating + gaussian(r) * 0.5), 1, 5);
            const createdAt = new Date(NOW.getTime() - r() * 180 * DAY_MS);
            ops.push({
                updateOne: {
                    filter: { theatreId: theatre._id, userId: person._id },
                    update: { $setOnInsert: {
                        theatreId: theatre._id, userId: person._id, rating,
                        cleanliness: aspect(), sound: aspect(), seating: aspect(),
                        comment: pick(r, THEATRE_COMMENTS[rating] ?? THEATRE_COMMENTS[3]),
                        createdAt, updatedAt: createdAt, __v: 0,
                    } },
                    upsert: true,
                },
            });
        }
    }
    const res = ops.length ? await TheatreReview.collection.bulkWrite(ops, { ordered: false }) : { upsertedCount: 0 };
    for (const { theatre } of theatres) await refreshRating(theatre._id);
    return res.upsertedCount;
}

// ── Run ───────────────────────────────────────────────────
async function main() {
    await connectDB();
    let redis = false;
    try {
        await Promise.race([connectRedis(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 5000))]);
        redis = true;
    } catch {
        console.warn("Redis unavailable — movie list cache will refresh on its own TTL");
    }

    const owners = await upsertUsers(OWNERS.map(({ name, email }) => ({ name, email })), USER_ROLE.client);
    const people = await upsertUsers(PEOPLE.map((name) => ({ name, email: emailFor(name) })), USER_ROLE.customer);
    console.log(`✔ ${owners.length} cinema operators, ${people.length} audience accounts`);

    const newMovies = await upsertMovies();
    const banners = await fillMissingBanners();
    const catalogue = await Movie.find({ isActive: true }).lean();
    console.log(`✔ ${newMovies} movies added, ${banners} hero banners filled (${catalogue.length} active in catalogue)`);

    const { theatres, created } = await upsertTheatres(owners, catalogue);
    const refreshed = await refreshExistingProgrammes(catalogue, theatres.map((t) => t.theatre._id));
    console.log(`✔ ${created} cinemas added, ${refreshed} existing cinema(s) given the current programme`);

    const movieReviews = await seedMovieReviews(catalogue, people);
    const theatreReviews = await seedTheatreReviews(theatres, people);
    console.log(`✔ ${movieReviews} movie reviews, ${theatreReviews} theatre reviews added; ratings recalculated`);

    const sched = await runAutoScheduler();
    if (sched) console.log(`✔ ${sched.created} shows scheduled for the coming week (${sched.released} movie(s) released, ${sched.pruned} old shows pruned)`);
    else console.log("• Auto-scheduler is already running on a server instance — shows will appear shortly");

    if (redis) await invalidateMovieListCache().catch(() => {});
    await mongoose.disconnect();
    if (redis) await Promise.allSettled([pubClient.quit(), subClient.quit(), redisClient.quit()]);
    process.exit(0);   // an unreachable Redis keeps retrying in the background otherwise
}

main().catch(async (e) => {
    console.error("Seed failed:", e);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
