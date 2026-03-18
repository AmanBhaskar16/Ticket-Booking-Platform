import express from "express";
import {
  createShow,
  deleteShow,
  getShows,
  getShow,
  updateShow,
  updateShowStatus,
} from "../controllers/show.controller.js";
import { isAdminOrClient, isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createShowSchema, updateShowSchema } from "../validations/show.validation.js";

const router = express.Router();

// ── PUBLIC ────────────────────────────────────────────────
router.get("/shows",      getShows);   // GET all (filter by theatreId, movieId, etc)
router.get("/shows/:id",  getShow);    // GET one

// ── CLIENT or ADMIN ───────────────────────────────────────
router.post  ("/shows",              isAuthenticated, isAdminOrClient, validate(createShowSchema), createShow);
router.patch ("/shows/:id",          isAuthenticated, isAdminOrClient, validate(updateShowSchema), updateShow);
router.patch ("/shows/:id/status",   isAuthenticated, isAdminOrClient, updateShowStatus);   // soft delete
router.delete("/shows/:id",          isAuthenticated, isAdminOrClient, deleteShow);         // hard delete

export default router;