import { successResponseBody, errorResponseBody } from "../utils/response.utils.js";
import { STATUS_CODES } from "../utils/constants.js";
import {
    initiateBookingService,
    confirmBookingService,
    cancelBookingService,
    getUserBookingsService,
    getBookingService,
    getAllBookingsService,
} from "../services/booking.service.js";

// POST /bookings/initiate
export const initiateBooking = async (req, res) => {
    try {
        const response = await initiateBookingService({
            showId: req.body.showId,
            seats:  req.body.seats,
            userId: req.user._id,
        });
        successResponseBody.message = "Booking initiated successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.CREATED).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// POST /bookings/confirm
export const confirmBooking = async (req, res) => {
    try {
        const response = await confirmBookingService({
            bookingId:             req.body.bookingId,
            stripePaymentIntentId: req.body.stripePaymentIntentId,
            userId:                req.user._id,
        });
        successResponseBody.message = "Booking confirmed successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// POST /bookings/cancel
export const cancelBooking = async (req, res) => {
    try {
        const response = await cancelBookingService({
            bookingId:          req.body.bookingId,
            userId:             req.user._id,
            cancellationReason: req.body.cancellationReason,
        });
        successResponseBody.message = "Booking cancelled successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// GET /bookings/my
export const getMyBookings = async (req, res) => {
    try {
        const response = await getUserBookingsService(req.user._id);
        successResponseBody.message = "Bookings fetched successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// GET /bookings/:id
export const getBooking = async (req, res) => {
    try {
        const response = await getBookingService(req.params.id, req.user._id);
        successResponseBody.message = "Booking fetched successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// GET /bookings (admin)
export const getAllBookings = async (req, res) => {
    try {
        const response = await getAllBookingsService(req.query);
        successResponseBody.message = "All bookings fetched successfully";
        successResponseBody.data    = response;
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};

// POST /bookings/expire-stale (internal cron — admin only)
export const expireStaleBookings = async (req, res) => {
    try {
        const { expireStaleBookingsService } = await import("../services/booking.service.js");
        const count = await expireStaleBookingsService();
        successResponseBody.message = `${count} stale bookings expired`;
        successResponseBody.data    = { count };
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error.message ?? error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
};