// validators/index.js
import { body, oneOf, param, cookie } from "express-validator";

/** REGISTER: require email, username, password; optional fullName */
const userRegisterValidator = () => [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail()
    .normalizeEmail(),

  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters long")
    .matches(/^[a-z0-9._-]+$/i)
    .withMessage(
      "Username can contain letters, numbers, dot, underscore, and hyphen only",
    )
    .customSanitizer((v) => v.toLowerCase()),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("fullName")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Full name cannot be empty"),
];

/** LOGIN: EITHER email OR username must be present; password required */
const userLoginValidator = () => [
  oneOf(
    [
      body("email")
        .exists({ checkFalsy: true })
        .bail()
        .isEmail()
        .withMessage("Enter a valid email")
        .bail()
        .normalizeEmail(),

      body("username")
        .exists({ checkFalsy: true })
        .bail()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-z0-9._-]+$/i)
        .withMessage(
          "Username can contain letters, numbers, dot, underscore, and hyphen only",
        )
        .customSanitizer((v) => v.toLowerCase()),
    ],
    "Provide either email or username",
  ),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
];

/** VERIFY EMAIL: token in params (unhashed hex token sent in URL) */
const verifyEmailValidator = () => [
  param("verificationToken")
    .exists({ checkFalsy: true })
    .withMessage("Email verification token is required")
    .bail()
    .isLength({ min: 32, max: 128 })
    .withMessage("Verification token length looks invalid")
    .isHexadecimal()
    .withMessage("Verification token must be hexadecimal"),
];

/** RESEND EMAIL VERIFICATION: no body needed; route should be protected with verifyJWT */
const resendEmailVerificationValidator = () => [];

/** REFRESH ACCESS TOKEN: token can be in cookie or in body */
const refreshAccessTokenValidator = () => [
  oneOf(
    [
      cookie("refreshToken").exists({ checkFalsy: true }),
      body("refreshToken").exists({ checkFalsy: true }),
    ],
    "Refresh token is missing",
  ),
  body("refreshToken")
    .optional()
    .isString()
    .isLength({ min: 20, max: 1000 })
    .withMessage("Refresh token format is invalid"),
];

/** FORGOT PASSWORD REQUEST: require email */
const forgotPasswordRequestValidator = () => [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .bail()
    .normalizeEmail(),
];

/** RESET FORGOT PASSWORD: token in params + newPassword in body */
const resetForgotPasswordValidator = () => [
  param("resetToken")
    .exists({ checkFalsy: true })
    .withMessage("Reset token is required")
    .bail()
    .isLength({ min: 32, max: 128 })
    .withMessage("Reset token length looks invalid")
    .isHexadecimal()
    .withMessage("Reset token must be hexadecimal"),

  body("newPassword")
    .exists({ checkFalsy: true })
    .withMessage("New password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];

/** CHANGE CURRENT PASSWORD: oldPassword + newPassword (must differ) */
const changeCurrentPasswordValidator = () => [
  body("oldPassword")
    .exists({ checkFalsy: true })
    .withMessage("Old password is required"),

  body("newPassword")
    .exists({ checkFalsy: true })
    .withMessage("New password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .custom((val, { req }) => {
      if (val === req.body.oldPassword) {
        throw new Error("New password must be different from old password");
      }
      return true;
    }),
];

export {
  userRegisterValidator,
  userLoginValidator,
  verifyEmailValidator,
  resendEmailVerificationValidator,
  refreshAccessTokenValidator,
  forgotPasswordRequestValidator,
  resetForgotPasswordValidator,
  changeCurrentPasswordValidator,
};
