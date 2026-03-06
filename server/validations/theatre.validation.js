import { z } from "zod";

// Create Theatre Validation
export const theatreCreateSchema = z.object({
  name: z.string()
    .min(5, "Theatre name must be at least 5 characters")
    .max(100, "Theatre name cannot exceed 100 characters"),
  description: z.string().optional(),
  city: z.string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name cannot exceed 50 characters"),
  pincode: z.number()
    .int("Pincode must be an integer")
    .min(100000, "Pincode must be a valid 6-digit number")
    .max(999999, "Pincode must be a valid 6-digit number"),
  address: z.string()
  .min(5, "Theatre name must be at least 5 characters")
  .max(100, "Theatre name cannot exceed 100 characters"),
  owner: z.string().length(24, "Owner must be a valid user id"), // ObjectId length
  movies: z.array(z.string().length(24, "Movie IDs must be valid ObjectIds")).optional()
});

// Update Theatre Validation (PATCH)
export const theatreUpdateSchema = theatreCreateSchema.partial();