import express from "express";
import { isAuthenticated, validateResetPasswordRequest, validateSigninRequest, validateSignupRequest } from "../middlewares/auth.middleware.js";
import { resetPassword, signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/auth/signup',validateSignupRequest,signup);

router.post('/auth/signin',validateSigninRequest,signin);

router.patch('/auth/reset',isAuthenticated,validateResetPasswordRequest,resetPassword);

export default router;