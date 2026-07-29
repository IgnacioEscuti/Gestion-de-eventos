import { ticketService } from "../services/ticket.service.js"


export async function createTicket(req, res, next) {
    try {
        const newTicket = await ticketService.createTicket(req.user.id, req.params.eventId, req.body.quantity);
        res.status(201).json({ ticket: newTicket });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getTicket(req, res, next) {
    try {
        const ticket = await ticketService.getTicketById(req.params.id, req.user.id, req.user.role);
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
        const tickets = await ticketService.getAllTickets(req.query, req.user.id, req.user.role);
        res.status(200).json({ tickets })
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}


export async function cancelTicket(req, res, next) {
    try {
        const ticket = await ticketService.cancelTicket(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ ticket })
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getTicketsByEvent(req, res) {
    try {
        const tickets = await ticketService.getTicketsByEvent(req.params.eventId, req.user.id, req.user.role);
        res.status(200).json({ tickets });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

