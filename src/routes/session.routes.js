import { Router } from "express";
import { getCurrentUser, login, register, logout } from "../controllers/session.controllers.js";
import { validateEmail, validateLoginFields, validatePassword, validateUser } from "../middlewares/session.middlewares.js";
import { authenticateRegister, authenticateLogin } from "../middlewares/passport.middlewares.js";
import { authenticateCurrent } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", validateUser, validateEmail, validatePassword,
    authenticateRegister, register);

router.post("/login", validateLoginFields,
    authenticateLogin, login);

router.get("/current",
    authenticateCurrent, getCurrentUser);
    
router.post("/logout", logout);

export default router;