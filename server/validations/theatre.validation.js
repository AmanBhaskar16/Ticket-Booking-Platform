import { z } from "zod";

export const theatreCreateSchema = z.object({
  name: z.string()
    .min(5, "Theatre name must be at least 5 characters")
    .max(100, "Theatre name cannot exceed 100 characters"),

  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),

  state: z.string()              // ← NEW
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),

  pincode: z.number()
    .int("Pincode must be an integer")
    .min(100000, "Pincode must be a valid 6-digit number")
    .max(999999, "Pincode must be a valid 6-digit number"),

  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters"),

  owner: z.string()
    .length(24, "Owner must be a valid ObjectId"),

  movies: z.array(
    z.string().length(24, "Each movie ID must be a valid ObjectId")
  ).optional(),

  totalScreens: z.number()       // ← NEW
    .int("Total screens must be a whole number")
    .min(1, "Theatre must have at least 1 screen")
    .default(1),

  amenities: z.array(z.string()) // ← NEW
    .optional()
    .default([]),

  images: z.array(               // ← NEW
    z.string().url("Each image must be a valid URL")
  ).optional()
  .default([]),
});

export const theatreUpdateSchema = theatreCreateSchema.partial();