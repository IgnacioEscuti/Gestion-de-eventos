import { Router } from "express";
import { getTicket, createTicket, getUserTickets, getAllTickets, cancelTicket } from "../controllers/ticket.controllers.js";
import { authenticateCurrent} from "../middlewares/auth.middlewares.js"
import { authorizeRoles } from "../middlewares/authorize.middleware.js";


const router = Router();

router.post("/", authenticateCurrent, createTicket);
router.get("/all", authenticateCurrent, authorizeRoles(["admin", "organizer"]), getAllTickets);
router.get("/:id", authenticateCurrent, getTicket);
router.get("/", authenticateCurrent, getUserTickets);
router.patch("/:id", authenticateCurrent, cancelTicket);



export default router;