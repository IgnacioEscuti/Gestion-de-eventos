import { Router } from "express";
import { getCurrentUser, login, register, logout } from "../controllers/session.controllers.js";
import { validateEmail, validateLoginFields, validatePassword, validateUser } from "../middlewares/session.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateUser, validateEmail, validatePassword, register);
router.post("/login", validateLoginFields, login);
router.get("/current", authMiddleware, getCurrentUser);
router.post("/logout", logout);

export default router;