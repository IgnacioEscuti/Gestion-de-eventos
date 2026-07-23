import { Router } from "express";
import { getAllEvents, createEvent, modifyEvent, getEvent, changeEventStatus } from "../controllers/event.controllers.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { authenticateCurrent } from "../middlewares/auth.middlewares.js";


const router = Router();


router.post("/", authenticateCurrent, authorizeRoles(["admin", "organizer"]), createEvent);

router.put("/:id", authenticateCurrent, authorizeRoles(["admin", "organizer"]), modifyEvent);

router.get("/", getAllEvents);

router.get("/:id", getEvent );

router.patch("/:id/status", authenticateCurrent, authorizeRoles(["admin", "organizer"]), changeEventStatus);

export default router;