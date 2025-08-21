// validators/index.js
import { body, oneOf } from "express-validator";

/**
 * Registration: require BOTH email and username.
 * - Properly sanitize email and username
 * - Disallow empty fullName only if provided
 */
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
    // toLowerCase is a sanitizer; don't chain withMessage after it
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

/**
 * Login: require EITHER a valid email OR a valid username + password.
 * - `oneOf` enforces at least one of the two identifiers
 * - Each branch does its own validation/sanitization
 */
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

export { userRegisterValidator, userLoginValidator };
