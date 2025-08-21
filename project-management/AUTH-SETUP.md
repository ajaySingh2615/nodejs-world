# AUTH-SETUP.md

A concise, end-to-end guide to the authentication stack we just implemented and validated for your Node.js / Express app.

---

## What we built & verified

- **Validation layer (express-validator)** for all auth endpoints: registration, login (email **or** username), verify email, resend verification, refresh token, forgot/reset password, change password.
- **Controllers** aligned to a consistent `ApiResponse(statusCode, data, message)` shape; fixed missing imports and minor edge cases.
- **JWT middleware** (`verifyJWT`) that correctly reads tokens from **cookies** or `Authorization: Bearer`.
- **User model** with:
  - secure password hashing,
  - token helpers (access, refresh, temporary tokens),
  - helpful indexes,
  - safe JSON serialization (no secret leakage).
- **Mail utility** with Mailgen + Nodemailer for verification / reset flows.
- **Routes** wired under `/api/v1/auth` plus `healthcheck`.
- **Testing assets**: Postman Collection (v2.1), optional Postman environment, and a REST Client `.http` file.
- **App configuration**: CORS, cookies, JSON limits; ready for local dev and production.

---

## Project structure (relevant parts)

```
src/
  app.js
  routes/
    auth.routes.js
    healthcheck.routes.js
  controllers/
    auth.controllers.js
  middlewares/
    auth.middlewares.js
    validator.middlewares.js
  models/
    user.models.js
  utils/
    api-error.js
    api-response.js
    mail.js
  validators/
    index.js
```

---

## API contracts

### Response & Error shapes

- **ApiResponse**
  ```js
  new ApiResponse(statusCode, data, message = "success")
  // Example: new ApiResponse(200, { user }, "User fetched")
  ```

- **ApiError**
  ```js
  new ApiError(statusCode, message = "Something went wrong", errors = [], stack = "")
  // Example: throw new ApiError(401, "Unauthorized")
  ```

All controllers now return success in the `data` field with a human-readable `message`.

---

## Validation layer

Implemented with `express-validator`. Each validator exports a function returning an **array of middlewares**. Use it as `router.post(path, validator(), validate, controller)`.

- **Register** (`userRegisterValidator`)  
  Requires `email`, `username`, `password`; optional `fullName`. Sanitizes & normalizes.

- **Login** (`userLoginValidator`)  
  Accepts **either** `email` **or** `username` + `password`. Enforced via `oneOf([ emailBranch, usernameBranch ])`.

- **Verify Email** (`verifyEmailValidator`)  
  Validates `:verificationToken` path param (hex/length).

- **Resend Verification** (`resendEmailVerificationValidator`)  
  No body; route is protected by JWT (user must be logged in).

- **Refresh Token** (`refreshAccessTokenValidator`)  
  Accepts token from **cookie** or **body**; validates presence and basic format.

- **Forgot Password** (`forgotPasswordRequestValidator`)  
  Requires `email`.

- **Reset Password** (`resetForgotPasswordValidator`)  
  Validates `:resetToken` param and requires `newPassword`.

- **Change Password** (`changeCurrentPasswordValidator`)  
  Requires `oldPassword`, `newPassword` (must differ, min length).

`validate` middleware produces a `422` with a tidy `{ field: message }` list.

---

## User model

`models/user.models.js` implements:

- **Fields**
  - `username`, `email`: `unique`, `lowercase`, indexed.
  - `password`: hashed on save (`bcrypt`).
  - `isEmailVerified`, `refreshToken`.
  - Temporary token pairs for **email verification** and **password reset** with expiries.
  - `avatar` default.

- **Indexes**
  - `emailVerificationToken + emailVerificationTokenExpiry`
  - `forgotPasswordToken + forgotPasswordTokenExpiry`

- **Hooks**
  - `pre('save')`: hash password when modified.

- **Methods**
  - `isPasswordCorrect(plain)` → boolean
  - `generateAccessToken()` → JWT with `_id, email, username` (short expiry)
  - `generateRefreshToken()` → JWT with `_id` (longer expiry)
  - `generateTemporaryToken()` → `{ unHashedToken, hashedToken, tokenExpiry }` for email verify / reset

- **Serialization safety**
  - `toJSON` strips secrets and internal fields (`password`, tokens, `__v`).

> Tip (optional hardening): set `password: { select: false }` and use `.select('+password')` where you compare passwords.

---

## Auth middleware

`verifyJWT`:

- Reads token from:
  - `req.cookies.accessToken`, or
  - `Authorization: Bearer <token>`
- Verifies using `ACCESS_TOKEN_SECRET`.
- Loads user (without sensitive fields) and assigns to `req.user`.
- Throws `401` if invalid or missing.

`validate`:

- Collects `express-validator` errors and throws `422` with a compact error payload.

---

## Controllers overview

- **registerUser**
  - Prevents duplicate users by `email`/`username`.
  - Creates user, generates email verification token, stores hashed token + expiry.
  - Sends email with verification link.
  - Returns created user (safe fields only).

- **loginUser**
  - Accepts `email` **or** `username` + `password`.
  - Verifies credentials.
  - Issues `accessToken` + `refreshToken` (saved to user), sets both cookies.
  - Returns `{ user, accessToken, refreshToken }`.

- **logoutUser**
  - Clears DB `refreshToken`, clears cookies.

- **getCurrentUser**
  - Returns `req.user` (from JWT).

- **verifyEmail**
  - Validates URL token (hash compare + expiry).
  - Marks email verified.

- **resendEmailVerification**
  - Requires auth, re-issues verification token, sends email.

- **refreshAccessToken**
  - Accepts refresh token from cookie or body.
  - Validates token and DB match; rotates tokens.
  - Returns new tokens and sets cookies.

- **forgotPasswordRequest**
  - Generates reset token, emails reset link.

- **resetForgotPassword**
  - Validates token & expiry, sets new password.

- **changeCurrentPassword**
  - Verifies `oldPassword`, updates to `newPassword`.

---

## Routes

Registered in `app.js`:

```js
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/auth", authRoutes);
```

**Auth route map:**

| Method | Path                                       | Auth | Validator                              | Controller                 |
|-------:|--------------------------------------------|:----:|-----------------------------------------|---------------------------|
|  POST  | `/api/v1/auth/register`                    |  ⛔  | `userRegisterValidator()`               | `registerUser`            |
|  POST  | `/api/v1/auth/login`                       |  ⛔  | `userLoginValidator()`                  | `loginUser`               |
|  POST  | `/api/v1/auth/logout`                      |  ✅  | —                                       | `logoutUser`              |
|   GET  | `/api/v1/auth/me`                          |  ✅  | —                                       | `getCurrentUser`          |
|   GET  | `/api/v1/auth/verify-email/:verificationToken` | ⛔ | `verifyEmailValidator()`                | `verifyEmail`             |
|  POST  | `/api/v1/auth/resend-verification`         |  ✅  | `resendEmailVerificationValidator()`    | `resendEmailVerification` |
|  POST  | `/api/v1/auth/refresh-token`               |  ⛔  | `refreshAccessTokenValidator()`         | `refreshAccessToken`      |
|  POST  | `/api/v1/auth/forgot-password`             |  ⛔  | `forgotPasswordRequestValidator()`      | `forgotPasswordRequest`   |
|  POST  | `/api/v1/auth/reset-password/:resetToken`  |  ⛔  | `resetForgotPasswordValidator()`        | `resetForgotPassword`     |
|  POST  | `/api/v1/auth/change-password`             |  ✅  | `changeCurrentPasswordValidator()`      | `changeCurrentPassword`   |

> ✅ = requires `verifyJWT`  
> ⛔ = public

---

## Email service

`utils/mail.js` uses **Mailgen** for HTML + plaintext, and **Nodemailer** with Mailtrap SMTP creds:

- `emailVerificationTemplate(username, link)`
- `forgotPasswordTemplate(username, link)`
- `sendEmail({ email, subject, mailGenContent })`

Configure via `.env` (see below).

---

## Environment variables

Create `.env` from this example:

```bash
PORT=8000
NODE_ENV=development

# Mongo
MONGODB_URI=mongodb://localhost:27017/project_management

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:8000

# JWT
ACCESS_TOKEN_SECRET=replace_with_strong_random
REFRESH_TOKEN_SECRET=replace_with_strong_random
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Mailtrap
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_user
MAILTRAP_SMTP_PASS=your_pass

# Frontend reset link
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
```

---

## Testing

### Postman

- **Import the collection** provided earlier (“Project Management Auth API”).
- Optional: import the **“Local Auth API”** environment and set `baseUrl`.
- Run **Register → Login → Me → Resend Verification → Verify Email → Change Password → Logout**.
- For **Forgot/Reset**, copy tokens from Mailtrap and paste into variables.

### REST Client (`auth.http`)

- Paste the provided `.http` file into VS Code and execute requests inline.

### CI with Newman (optional)

- Use the workflow snippet to run Postman tests in GitHub Actions and export an HTML report.

---

## Security & ops checklist

- **Cookies**: `httpOnly`, `sameSite: 'lax'`, `secure: NODE_ENV==='production'`.
- **Helmet + rate limiting** on auth routes (recommended in production).
- **Input hardening**: `express-mongo-sanitize`, `hpp`.
- **Refresh token**: consider **hashing** before storing and **reuse detection + rotation** if you plan multi-device sessions.
- **ESM imports**: include `.js` extensions and use correct relative paths.

---

## Next steps (optional enhancements)

- Add **Swagger / OpenAPI** at `/docs` for live API reference.
- Store refresh tokens per device with **user-agent** & **IP** metadata for session management.
- Add email throttling for resend / forgot endpoints.
- Add username availability endpoint (`/username-availability?u=...`).

---

**That’s it!** This document captures everything we implemented and why, so teammates can understand the flow, run it locally, and extend it safely.
