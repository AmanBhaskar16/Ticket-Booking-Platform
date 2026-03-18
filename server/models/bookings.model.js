import mongoose from "mongoose";
import { BOOKING_STATUS } from "../utils/constants.js";

const bookingSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    seats: {
        type: [String],
        required: true,
        validate: {
            validator: (v) => v.length > 0,
            message: "At least one seat is required"
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: Object.values(BOOKING_STATUS),
        default: BOOKING_STATUS.processing
    },
    // Stripe payment
    stripePaymentIntentId: {
        type: String,
        default: null
    },
    stripeClientSecret: {
        type: String,
        default: null
    },
    // Ticket
    ticketCode: {
        type: String,
        unique: true,
        sparse: true   // null values allowed (set after confirmation)
    },
    // Cancellation
    cancelledAt: {
        type: Date,
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Indexes for common queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showId: 1, status: 1 });
bookingSchema.index({ stripePaymentIntentId: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;