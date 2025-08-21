// middlewares/auth.middlewares.js
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Support both cookie and Authorization header
  const authHeader = req.get("authorization") || req.headers?.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  const token = req.cookies?.accessToken || headerToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized request");
  }
});
