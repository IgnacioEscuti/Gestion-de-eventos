import { Router } from "express";
import { login, logout } from "../controllers/session.controllers.js";

const router = Router();

router.get("/", login);
router.get("/", logout);

export default router;