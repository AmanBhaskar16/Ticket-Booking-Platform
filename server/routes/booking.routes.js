import express from "express";
import {initiateBooking,confirmBooking,cancelBooking,getMyBookings,getBooking,getAllBookings} from "../controllers/booking.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {initiateBookingSchema,confirmBookingSchema,cancelBookingSchema} from "../validations/booking.validation.js";

const router = express.Router();

// ── CUSTOMER ──────────────────────────────────────────────
router.post("/bookings/initiate", isAuthenticated, validate(initiateBookingSchema), initiateBooking);
router.post("/bookings/confirm",  isAuthenticated, validate(confirmBookingSchema),  confirmBooking);
router.post("/bookings/cancel",   isAuthenticated, validate(cancelBookingSchema),   cancelBooking);
router.get ("/bookings/my",       isAuthenticated, getMyBookings);
router.get ("/bookings/:id",      isAuthenticated, getBooking);

// ── ADMIN ─────────────────────────────────────────────────
router.get ("/bookings",          isAuthenticated, isAdmin, getAllBookings);

export default router;