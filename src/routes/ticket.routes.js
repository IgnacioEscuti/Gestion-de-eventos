import { Router } from "express";
import { getTicket, createTicket } from "../controllers/ticket.controllers.js";

const router = Router();

router.get("/", getTicket);

router.post("/", createTicket);

export default router;