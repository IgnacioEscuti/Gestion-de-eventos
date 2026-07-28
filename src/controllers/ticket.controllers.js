import { ticketService } from "../services/ticket.service.js"


export async function createTicket(req, res, next) {
    try {
        const newTicket = await ticketService.createTicket(req.user.id, req.body.eventId);
        res.status(201).json({ ticket: newTicket });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getTicket(req, res, next) {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        res.status(200).json({ ticket });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getUserTickets(req, res, next) {
    try {
        const tickets = await ticketService.getUserTickets(req.user.id);
        res.status(200).json({ tickets })
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getAllTickets(req, res, next) {
    try {
        const tickets = await ticketService.getAllTickets(req.query);
        res.status(200).json({ tickets })
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}


export async function cancelTicket(req, res, next) {
    try {
        const ticket = await ticketService.cancelTicket( req.params.id, req.user.id, req.user.role);
        res.status(200).json({ ticket })
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

