import { z } from "zod";

// POST /bookings/initiate
export const initiateBookingSchema = z.object({
    showId: z.string().length(24, "Invalid showId"),
    seats:  z.array(z.string().trim()).min(1, "At least one seat must be selected"),
});

// POST /bookings/confirm
export const confirmBookingSchema = z.object({
    bookingId:             z.string().length(24, "Invalid bookingId"),
    stripePaymentIntentId: z.string().min(1, "Payment intent ID is required"),
});

// POST /bookings/cancel
export const cancelBookingSchema = z.object({
    bookingId:          z.string().length(24, "Invalid bookingId"),
    cancellationReason: z.string().max(300).optional(),
});