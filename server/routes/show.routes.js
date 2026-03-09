
import express from "express";
import { create, destroy, getShows, update } from "../controllers/show.controller.js";
import { isAdminOrClient, isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createShowSchema, updateShowSchema } from "../validations/show.validation.js";

const router = express.Router();

router.post('/shows',isAuthenticated,isAdminOrClient,validate(createShowSchema),create);

router.get('/shows',getShows);

router.delete('/shows/:id',isAuthenticated,isAdminOrClient,destroy);

router.patch('/shows/:id',isAuthenticated,isAdminOrClient,validate(updateShowSchema),update);

export default router;