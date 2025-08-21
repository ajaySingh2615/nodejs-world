import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";
// import { userLoginValidator } from "../validators/index.js";
import { userRegisterValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(loginUser);

export default router;
