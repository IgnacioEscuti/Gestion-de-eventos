import { Router } from "express";
import { login, logout} from "../controllers/session.controllers.js";

const router = Router();

router.post("/", login);
router.delete("/", logout);

export default router;