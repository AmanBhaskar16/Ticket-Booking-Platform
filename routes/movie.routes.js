import express from "express";
import {createMovie, deleteMovie, getMovie,getMovies,updateMovie, updateMovieStatus} from "../controllers/movie.controller.js"
import { validate } from "../middlewares/movie.middleware.js";
import { movieSchema } from "../validations/movie.validation.js";

const router = express.Router();

// CREATE A MOVIE
router.post('/movies',validate(movieSchema),createMovie);
// DELETE A MOVIE
router.delete("/movies/:id",deleteMovie);
// GET A PARTICULAR MOVIE
router.get("/movies/:id",getMovie);
// UPDATE A PARTICULAR MOVIE
router.patch("/movies/:id",updateMovie);
// SETUP THE STATUS OF A PARTICULAR MOVIE
router.patch("/movies/:id/status", updateMovieStatus);
// GET ALL THE MOVIES
router.get("/movies",getMovies);

export default router;