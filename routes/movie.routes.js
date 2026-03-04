import express from "express";
import {createMovie, deleteMovie, getMovie} from "../controllers/movie.controller.js"

const router = express.Router();

router.post('/movies',createMovie);
router.delete("/movies/:id",deleteMovie);
router.get("/movies/:id",getMovie);

export default router;