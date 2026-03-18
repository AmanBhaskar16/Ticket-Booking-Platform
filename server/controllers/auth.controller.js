import jwt from "jsonwebtoken";
import { successResponseBody, errorResponseBody } from "../utils/response.utils.js";
import { createUser, getUserByEmail, getUserById } from "../services/user.service.js";
import { STATUS_CODES } from "../utils/constants.js";

export const signup = async (req, res) => {
  try {
    const response = await createUser(req.body);
    successResponseBody.message = "Successfully registered a user";
    successResponseBody.data    = response;
    return res.status(STATUS_CODES.CREATED).json(successResponseBody);
  } catch (error) {
    if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
    errorResponseBody.err = error;
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

export const signin = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);

    const isValidPassword = await user.isValidPassword(req.body.password);
    if (!isValidPassword)
      throw { err: "Invalid password for the given email", code: STATUS_CODES.UNAUTHORISED };

    // REJECTED users cannot login at all
    // PENDING users CAN login — frontend shows pending wall
    if (user.userStatus === "REJECTED")
      throw { err: "Your account has been rejected. Please contact support.", code: STATUS_CODES.FORBIDDEN };

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.AUTH_KEY,
      { expiresIn: "24h" }   // ← increased from 1h — better UX
    );

    successResponseBody.message = "Successfully logged in";
    successResponseBody.data    = {
      token,
      user: {
        id:         user._id,
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        phone:      user.phone   ?? "",
        avatar:     user.avatar  ?? "",
        userRole:   user.userRole,
        userStatus: user.userStatus,
        createdAt:  user.createdAt,
      },
    };

    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
    errorResponseBody.err = error;
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await getUserById(req.user);

    const isOldPasswordCorrect = await user.isValidPassword(req.body.oldPassword);
    if (!isOldPasswordCorrect)
      throw { err: "Invalid old password", code: STATUS_CODES.FORBIDDEN };

    const isSamePassword = await user.isValidPassword(req.body.newPassword);
    if (isSamePassword)
      throw { err: "New password cannot be same as old password", code: STATUS_CODES.BAD_REQUEST };

    user.password = req.body.newPassword;
    await user.save();

    successResponseBody.message = "Password updated successfully";
    successResponseBody.data    = { id: user._id, email: user.email }; // ← never return full user object after password ops
    return res.status(STATUS_CODES.OK).json(successResponseBody);
  } catch (error) {
    if (error.err) { errorResponseBody.err = error.err; return res.status(error.code).json(errorResponseBody); }
    errorResponseBody.err = error;
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};