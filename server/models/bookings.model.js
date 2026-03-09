import mongoose from "mongoose";
import { BOOKING_STATUS } from '../utils/constants.js';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [BOOKING_STATUS.processing, BOOKING_STATUS.cancelled, BOOKING_STATUS.successful, BOOKING_STATUS.expired],
            message: "Invalid booking status"
        },
        default: BOOKING_STATUS.processing
    },
    seat: {
        type: [String],
        required: true
    }
}, {timestamps: true});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;