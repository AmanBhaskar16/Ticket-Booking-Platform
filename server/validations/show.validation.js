import { z } from "zod";

export const createShowSchema = z.object({
  theatreId: z
    .string()
    .length(24, "Invalid theatreId"),

  movieId: z
    .string()
    .length(24, "Invalid movieId"),

  showTime: z
    .string()
    .datetime("Invalid showTime format"),

  noOfSeats: z
    .number()
    .int()
    .positive("Seats must be greater than 0"),

  seatConfiguration: z
    .string()
    .optional(),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  format: z
    .enum(["2D", "3D", "IMAX", "4DX"])
    .optional()
});

export const updateShowSchema = createShowSchema.partial();