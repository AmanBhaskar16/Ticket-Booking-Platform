import { z } from "zod";

export const createBookingSchema = z.object({
  showId: z
    .string()
    .length(24, "Invalid showId"),

  seat: z
    .array(z.string())
    .min(1, "At least one seat must be selected")
});
