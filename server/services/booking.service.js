import Stripe    from "stripe";
import crypto    from "crypto";
import mongoose  from "mongoose";
import Booking   from "../models/bookings.model.js";
import Show      from "../models/show.model.js";
import User from "../models/user.model.js";
import { BOOKING_STATUS, STATUS_CODES } from "../utils/constants.js";
import { emitBookingConfirmed, emitBookingCancelled } from "../socket.js";
import { sendBookingConfirmEmail, sendBookingCancelEmail } from "../services/email.service.js";

// Lazy init — ensures dotenv is loaded before Stripe is created
let _stripe = null;
const getStripe = () => {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return _stripe;
};

// ── Helper ────────────────────────────────────────────────
const generateTicketCode = () =>
    "CV-" + crypto.randomBytes(6).toString("hex").toUpperCase();

// ── INITIATE BOOKING ─────────────────────────────────────
// Uses MongoDB transaction for atomic seat locking
// Prevents double booking at DB level
export const initiateBookingService = async ({ showId, seats, userId }) => {
    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            // 1. Fetch show inside transaction with session
            const show = await Show.findById(showId)
                .populate("movieId",   "name posterUrl duration")
                .populate("theatreId", "name city address")
                .session(session);

            if (!show)
                throw { err: "Show not found", code: STATUS_CODES.NOT_FOUND };

            if (show.isActive === false)
                throw { err: "This show is no longer active", code: STATUS_CODES.BAD_REQUEST };

            // 2. Check each requested seat is not already booked
            const conflicting = seats.filter(s => show.bookedSeats.includes(s));
            if (conflicting.length > 0) {
                throw {
                    err:  `Seats already taken: ${conflicting.join(", ")}`,
                    code: STATUS_CODES.CONFLICT,
                };
            }

            // 3. Check total capacity
            const available = show.noOfSeats - show.bookedSeats.length;
            if (seats.length > available) {
                throw {
                    err:  `Only ${available} seat(s) available`,
                    code: STATUS_CODES.BAD_REQUEST,
                };
            }

            const totalAmount = seats.length * show.price;

            // 4. Atomically add seats to bookedSeats
            //    Using $addToSet won't help here — we need strict check + set
            //    So we use findOneAndUpdate with a condition that ALL seats are free
            const updated = await Show.findOneAndUpdate(
                {
                    _id:         showId,
                    bookedSeats: { $not: { $elemMatch: { $in: seats } } }, // none of these seats booked
                },
                { $push: { bookedSeats: { $each: seats } } },
                { new: true, session }
            );

            if (!updated) {
                // Race condition — another request booked one of these seats
                throw {
                    err:  "One or more seats were just booked by someone else. Please re-select.",
                    code: STATUS_CODES.CONFLICT,
                };
            }

            // 5. Create Stripe PaymentIntent
            const paymentIntent = await getStripe().paymentIntents.create({
                amount:   totalAmount * 100, // paise
                currency: "inr",
                metadata: {
                    showId:  showId.toString(),
                    userId:  userId.toString(),
                    seats:   seats.join(","),
                },
            });

            // 6. Create booking record
            const [booking] = await Booking.create([{
                showId,
                userId,
                seats,
                totalAmount,
                status:                BOOKING_STATUS.processing,
                stripePaymentIntentId: paymentIntent.id,
                stripeClientSecret:    paymentIntent.client_secret,
            }], { session });

            result = {
                bookingId:    booking._id,
                clientSecret: paymentIntent.client_secret,
                totalAmount,
                seats,
                show: {
                    name:     show.movieId?.name,
                    poster:   show.movieId?.posterUrl,
                    duration: show.movieId?.duration,
                    theatre:  show.theatreId?.name,
                    city:     show.theatreId?.city,
                    address:  show.theatreId?.address,
                    showTime: show.showTime,
                    format:   show.format,
                    language: show.language,
                    screen:   show.screen,
                    price:    show.price,
                },
            };
        });

        return result;

    } finally {
        await session.endSession();
    }
};

// ── CONFIRM BOOKING ──────────────────────────────────────
export const confirmBookingService = async ({ bookingId, stripePaymentIntentId, userId }) => {
    // Verify payment with Stripe first (outside transaction — network call)
    const paymentIntent = await getStripe().paymentIntents.retrieve(stripePaymentIntentId);
    if (paymentIntent.status !== "succeeded") {
        throw { err: "Payment not completed", code: STATUS_CODES.BAD_REQUEST };
    }

    const session = await mongoose.startSession();

    try {
        let booking;

        await session.withTransaction(async () => {
            booking = await Booking.findOneAndUpdate(
                {
                    _id:    bookingId,
                    userId: userId,
                    status: BOOKING_STATUS.processing,
                    stripePaymentIntentId,
                },
                {
                    status:     BOOKING_STATUS.successful,
                    ticketCode: generateTicketCode(),
                },
                { new: true, session }
            ).populate({
                path: "showId",
                populate: [
                    { path: "movieId",   select: "name posterUrl duration genre certificate" },
                    { path: "theatreId", select: "name city address pincode" },
                ],
            });

            if (!booking) {
                throw {
                    err:  "Booking not found or already processed",
                    code: STATUS_CODES.BAD_REQUEST,
                };
            }
        });

        // Emit socket event — seats permanently booked (async: also clears Redis locks)
        emitBookingConfirmed(booking.showId._id.toString(), booking.seats).catch(console.error);

        // Send confirmation email (non-blocking)
        const show    = booking.showId;
        const movie   = show?.movieId;
        const theatre = show?.theatreId;
        const user    = await User.findById(booking.userId).select("name email");
        if (user && movie && theatre) {
            sendBookingConfirmEmail({ booking, user, show, movie, theatre }).catch(console.error);
        }

        return booking;

    } finally {
        await session.endSession();
    }
};

// ── CANCEL BOOKING ───────────────────────────────────────
export const cancelBookingService = async ({ bookingId, userId, cancellationReason }) => {
    const session = await mongoose.startSession();

    try {
        let booking;
        let wasProcessing = false;

        await session.withTransaction(async () => {
            const existing = await Booking.findOne({
                _id:    bookingId,
                userId: userId,
                status: { $in: [BOOKING_STATUS.processing, BOOKING_STATUS.successful] },
            }).session(session);

            if (!existing) {
                throw {
                    err:  "Booking not found or cannot be cancelled",
                    code: STATUS_CODES.BAD_REQUEST,
                };
            }

            wasProcessing = existing.status === BOOKING_STATUS.processing;
            // Find and update atomically
            booking = await Booking.findOneAndUpdate(
                {
                    _id:    bookingId,
                    userId: userId,
                    status: { $in: [BOOKING_STATUS.processing, BOOKING_STATUS.successful] },
                },
                {
                    status:             BOOKING_STATUS.cancelled,
                    cancelledAt:        new Date(),
                    cancellationReason: cancellationReason ?? "Cancelled by user",
                },
                { new: true, session }
            );

            if (!booking) {
                throw {
                    err:  "Booking not found or cannot be cancelled",
                    code: STATUS_CODES.BAD_REQUEST,
                };
            }

            // Release seats back to show
            await Show.findByIdAndUpdate(
                booking.showId,
                { $pull: { bookedSeats: { $in: booking.seats } } },
                { session }
            );
        });

        // Cancel Stripe PaymentIntent if still processing
        if (booking.stripePaymentIntentId && wasProcessing) {
            try {
                await getStripe().paymentIntents.cancel(booking.stripePaymentIntentId);
            } catch (e) {
                console.log("Stripe cancel skipped:", e.message);
            }
        }

        // Emit socket — seats released
        emitBookingCancelled(booking.showId.toString(), booking.seats);

        // Send cancellation email (non-blocking)
        const cancelUser = await User.findById(booking.userId).select("name email");
        const cancelShow = await Show.findById(booking.showId).populate("movieId", "name");
        const cancelMovie = cancelShow?.movieId;
        if (cancelUser) {
            sendBookingCancelEmail({ booking, user: cancelUser, movie: cancelMovie }).catch(console.error);
        }

        return booking;

    } finally {
        await session.endSession();
    }
};

// ── EXPIRE STALE BOOKINGS (cron job helper) ───────────────
// Call this every few minutes to release seats of abandoned bookings
export const expireStaleBookingsService = async () => {
    const EXPIRY_MINUTES = 10;
    const cutoff = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

    const staleBookings = await Booking.find({
        status:    BOOKING_STATUS.processing,
        createdAt: { $lt: cutoff },
    });

    for (const booking of staleBookings) {
        try {
            await cancelBookingService({
                bookingId:          booking._id,
                userId:             booking.userId,
                cancellationReason: "Payment timeout — auto expired",
            });
            console.log(`Expired booking: ${booking._id}`);
        } catch (e) {
            console.error(`Failed to expire booking ${booking._id}:`, e);
        }
    }

    return staleBookings.length;
};

// ── GET USER BOOKINGS ─────────────────────────────────────
export const getUserBookingsService = async (userId) => {
    return await Booking.find({ userId })
        .populate({
            path: "showId",
            populate: [
                { path: "movieId",   select: "name posterUrl duration genre certificate" },
                { path: "theatreId", select: "name city address" },
            ],
        })
        .sort({ createdAt: -1 });
};

// ── GET SINGLE BOOKING ────────────────────────────────────
export const getBookingService = async (bookingId, userId) => {
    const booking = await Booking.findById(bookingId)
        .populate({
            path: "showId",
            populate: [
                { path: "movieId",   select: "name posterUrl duration genre certificate director" },
                { path: "theatreId", select: "name city address pincode" },
            ],
        });

    if (!booking)
        throw { err: "Booking not found", code: STATUS_CODES.NOT_FOUND };

    if (booking.userId.toString() !== userId.toString())
        throw { err: "Unauthorized", code: STATUS_CODES.FORBIDDEN };

    return booking;
};

// ── GET ALL BOOKINGS (admin) ──────────────────────────────
export const getAllBookingsService = async (filter = {}) => {
    const { status, page = 1, limit = 50 } = filter;
    const query = {};
    if (status) query.status = status;

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .populate({
                path: "showId",
                populate: [
                    { path: "movieId",   select: "name posterUrl" },
                    { path: "theatreId", select: "name city" },
                ],
            })
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Booking.countDocuments(query),
    ]);

    return {
        bookings,
        pagination: {
            total,
            page:       pageNum,
            limit:      limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};
