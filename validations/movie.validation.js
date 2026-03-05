import { z } from "zod";

export const movieSchema = z.object({
  name: z.string().min(2).max(100),

  description: z.string().min(20).max(2000),

  casts: z.array(z.string()).min(1),

  languages: z.array(z.string()).min(1),

  releaseDate: z.string().date(),

  duration: z.number().positive(),

  posterUrl: z.string().url(),

  trailerUrl: z.string().url(),

  genre: z.array(z.string()).min(1),

  rating: z.number().min(0).max(10).optional(),

  certificate: z.enum(["G","PG","PG-13","R","U","UA","A"]),

  director: z.string(),

  releaseStatus: z.enum(["UPCOMING","RELEASED","ARCHIVED"])
});