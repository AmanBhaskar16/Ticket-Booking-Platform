import express from "express";
import {createMovie,deleteMovie,getMovie,getMovies,updateMovie,updateMovieStatus,} from "../controllers/movie.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { movieCreateSchema, movieUpdateSchema } from "../validations/movie.validation.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/movies",          getMovies);           // GET all (with filters)
router.get("/movies/:id",      getMovie);            // GET one

// ADMIN ONLY
router.post("/movies",         isAuthenticated, isAdmin, validate(movieCreateSchema), createMovie);
router.patch("/movies/:id",    isAuthenticated, isAdmin, validate(movieUpdateSchema), updateMovie);
router.patch("/movies/:id/status", isAuthenticated, isAdmin, updateMovieStatus);
router.delete("/movies/:id",   isAuthenticated, isAdmin, deleteMovie);

export default router;