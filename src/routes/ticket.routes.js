import { Router } from "express";
import { getTicket, getUserTickets, cancelTicket, getAllTickets } from "../controllers/ticket.controllers.js";
import { authenticateCurrent } from "../middlewares/auth.middlewares.js";
import { authorizeRoles} from "../middlewares/authorize.middleware.js"

const router = Router();

router.get("/my-tickets", authenticateCurrent, getUserTickets);
router.get("/all", authenticateCurrent, authorizeRoles(["admin", "organizer"]), getAllTickets);
router.get("/:id", authenticateCurrent, getTicket);
router.patch("/:id/cancel", authenticateCurrent, cancelTicket);

export default router;