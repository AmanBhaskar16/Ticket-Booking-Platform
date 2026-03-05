import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { theatreCreateSchema, theatreUpdateSchema } from "../validations/theatre.validation";

const router = express.Router();
// ADD A THEATRE
router.post("/theatres",validate(theatreCreateSchema),addTheatre);
// DELETE A THEATRE
router.delete("/theatres/:id",deleteTheatre);
// UPDATE A THEATRE
router.patch("/theatre/:id",validate(theatreUpdateSchema),updateTheatre);
// UPDATE MOVIES AVAILABLE IN A THEATRE
router.patch("/theatres/:id/movies",updateMovies);
// GET DETAILS OF A PATRTICULAR THEATRE
router.get("/theatres/:id",getTheatre);
// GET ALL THE THEATRES
router.get("/theatres",getTheatres);
// GET ALL THE MOVIES AVAILABLE IN A THEATRE
router.get("/theatres/:id/movies",getMovies);
// GET DETAILS OF A PARTICULAR MOVIE AVAILABLE IN A THEATRE
router.get("/theatres/:theatreId/movies/:movieId",checkMovie);

export default router;