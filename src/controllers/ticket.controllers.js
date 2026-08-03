import { ticketService } from "../services/ticket.service.js"
import { TicketDTO } from "../DTOs/ticket.dto.js"


export async function createTicket(req, res, next) {
    try {
        const newTicket = await ticketService.createTicket(req.user.id, req.params.eventId, req.body.quantity);
        res.status(201).json({ ticket: new TicketDTO(newTicket) });
    }
    catch (error) {
        next(error);
    }
}

export async function getTicket(req, res, next) {
    try {
        const ticket = await ticketService.getTicketById(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ ticket: new TicketDTO(ticket) });
    }
    catch (error) {
        next(error);
    }
}

export async function getUserTickets(req, res, next) {
    try {
        const tickets = await ticketService.getUserTickets(req.user.id);
        res.status(200).json({ tickets: tickets.map(ticket => new TicketDTO(ticket)) })
    }
    catch (error) {
        next(error);
    }
}

export async function getAllTickets(req, res, next) {
    try {
        const tickets = await ticketService.getAllTickets(req.query, req.user.id, req.user.role);
        res.status(200).json({ tickets: tickets.map(ticket => new TicketDTO(ticket)) })
    }
    catch (error) {
        next(error);
    }
}


export async function cancelTicket(req, res, next) {
    try {
        const ticket = await ticketService.cancelTicket(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ ticket: new TicketDTO(ticket) })
    }
    catch (error) {
        next(error);
    }
}

export async function getTicketsByEvent(req, res, next) {
    try {
        const tickets = await ticketService.getTicketsByEvent(req.params.eventId, req.user.id, req.user.role);
        res.status(200).json({ tickets: tickets.map(ticket => new TicketDTO(ticket)) });
    } catch (error) {
        next(error);
    }
}

