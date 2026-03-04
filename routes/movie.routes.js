import express from "express";
import {createMovie} from "../controllers/movie.controller.js"

const router = express.Router();

router.post('/movies',createMovie);

export default router;