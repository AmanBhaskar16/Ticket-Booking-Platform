import express from "express";
import { update } from "../controllers/user.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";
import { validateUpdateUserRequest } from "../middlewares/user.middleware.js";

const router = express.Router();

router.patch('/user/:id',isAuthenticated,isAdmin,validateUpdateUserRequest,update);

export default router;