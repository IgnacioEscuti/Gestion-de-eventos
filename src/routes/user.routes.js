import { Router } from "express";
import { getAllUsers } from "../controllers/user.controllers.js";
import { authenticateCurrent } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", authenticateCurrent, authorizeRoles(["admin"]), getAllUsers);


export default router;