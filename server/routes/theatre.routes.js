import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { theatreCreateSchema, theatreUpdateSchema } from "../validations/theatre.validation.js";
import { isAuthenticated, isAdminOrClient } from './../middlewares/auth.middleware.js';
import { addTheatre, checkMovies, deleteTheatre, getTheatre, getTheatres, updateMovies, updateTheatre } from "../controllers/theatre.controller.js";
import { getMovies } from "../controllers/movie.controller.js";

const router = express.Router();
// ADD A THEATRE
router.post("/theatres",isAuthenticated,isAdminOrClient,validate(theatreCreateSchema),addTheatre);
// DELETE A THEATRE
router.delete("/theatres/:id",isAuthenticated,isAdminOrClient,deleteTheatre);
// UPDATE A THEATRE
router.patch("/theatre/:id",isAuthenticated,isAdminOrClient,validate(theatreUpdateSchema),updateTheatre);
// UPDATE MOVIES AVAILABLE IN A THEATRE
router.patch("/theatres/:id/movies",isAuthenticated,isAdminOrClient,updateMovies);
// GET DETAILS OF A PATRTICULAR THEATRE
router.get("/theatres/:id",getTheatre);
// GET ALL THE THEATRES
router.get("/theatres",getTheatres);
// GET ALL THE MOVIES AVAILABLE IN A THEATRE
router.get("/theatres/:id/movies",getMovies);
// GET DETAILS OF A PARTICULAR MOVIE AVAILABLE IN A THEATRE
router.get("/theatres/:theatreId/movies/:movieId",checkMovies);

export default router;