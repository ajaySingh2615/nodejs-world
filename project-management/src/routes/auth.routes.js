import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
} from "../controllers/auth.controllers.js";
import {
  userRegisterValidator,
  userLoginValidator,
  verifyEmailValidator,
  resendEmailVerificationValidator,
  refreshAccessTokenValidator,
  forgotPasswordRequestValidator,
  resetForgotPasswordValidator,
  changeCurrentPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, registerUser);
router.post("/login", userLoginValidator(), validate, loginUser);
router.post("/logout", verifyJWT, logoutUser);

router.get("/me", verifyJWT, getCurrentUser);

router.get(
  "/verify-email/:verificationToken",
  verifyEmailValidator(),
  validate,
  verifyEmail,
);
router.post(
  "/resend-verification",
  verifyJWT,
  resendEmailVerificationValidator(),
  validate,
  resendEmailVerification,
);

router.post(
  "/refresh-token",
  refreshAccessTokenValidator(),
  validate,
  refreshAccessToken,
);

router.post(
  "/forgot-password",
  forgotPasswordRequestValidator(),
  validate,
  forgotPasswordRequest,
);
router.post(
  "/reset-password/:resetToken",
  resetForgotPasswordValidator(),
  validate,
  resetForgotPassword,
);

router.post(
  "/change-password",
  verifyJWT,
  changeCurrentPasswordValidator(),
  validate,
  changeCurrentPassword,
);

export default router;
