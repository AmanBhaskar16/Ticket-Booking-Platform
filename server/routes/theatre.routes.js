import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { theatreCreateSchema, theatreUpdateSchema } from "../validations/theatre.validation.js";
import { isAuthenticated, isAdminOrClient, isAdmin } from './../middlewares/auth.middleware.js';
import { addTheatre, checkMovies, deleteTheatre, getTheatre, getTheatreMovies, getTheatres, updateMovies, updateTheatre, updateTheatreStatus } from "../controllers/theatre.controller.js";

const router = express.Router();

// ── PUBLIC ────────────────────────────────────────────────
router.get("/theatres",                             getTheatres);
router.get("/theatres/:id",                         getTheatre);
router.get("/theatres/:id/movies",                  getTheatreMovies);
router.get("/theatres/:theatreId/movies/:movieId",  checkMovies);
 
// ── CLIENT or ADMIN ───────────────────────────────────────
router.post  ("/theatres",              isAuthenticated, isAdminOrClient, validate(theatreCreateSchema), addTheatre);
router.patch ("/theatres/:id",          isAuthenticated, isAdminOrClient, validate(theatreUpdateSchema), updateTheatre); 
router.patch ("/theatres/:id/movies",   isAuthenticated, isAdminOrClient, updateMovies);
router.patch ("/theatres/:id/status",   isAuthenticated, isAdminOrClient, updateTheatreStatus);  // soft delete
 
// ── ADMIN ONLY ────────────────────────────────────────────
router.delete("/theatres/:id",          isAuthenticated, isAdmin, deleteTheatre); // hard delete
export default router;