import { Router } from "express";
import { login, register } from "../controllers/session.controllers.js";
import { userExists, validateEmail, validatePassword, validateUser } from "../middlewares/session.middlewares.js";

const router = Router();

router.post("/register", validateUser, validateEmail, validatePassword, register);
router.post("/login", userExists, login);

export default router;