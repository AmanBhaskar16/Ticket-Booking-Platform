import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";
import { validateUpdateUserRequest } from "../middlewares/user.middleware.js";

const router = express.Router();

// ── ADMIN ONLY ────────────────────────────────────────────
router.get   ("/users",     isAuthenticated, isAdmin, getUsers);   // list all users (with filters)
router.get   ("/users/:id", isAuthenticated, isAdmin, getUser);    // get single user
router.patch ("/users/:id", isAuthenticated, isAdmin, validateUpdateUserRequest, updateUser); // update role/status
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser); // hard delete user

// Self-service routes (any authenticated user)
router.patch("/users/profile",         isAuthenticated, updateProfile);
router.patch("/users/change-password", isAuthenticated, changePassword);

export default router;