import { TicketDAO } from "../DAOs/ticket.dao.js";

const ticketDAO = new TicketDAO();

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(data) {
        return this.dao.create(data);
    }

    async findOne(data) {
        return this.dao.findOne(data);
    }

    async find(userId) {
        return this.dao.find(userId);
    }

    async findById(id) {
        return this.dao.findById(id);
    }

    async findByIdAndUpdate(id, data) {
        return this.dao.findByIdAndUpdate(id, data, { new: true });
    }

    async findActiveTicket(userId, eventId) {
        return this.dao.findOne({ user: userId, event: eventId, status: "active" });
    }

    async countActiveTickets(eventId) {
        const activeTickets = await this.dao.find({ event: eventId, status: "active" });
        return activeTickets.reduce((total, ticket) => total + ticket.quantity, 0);
    }

    async cancelTicket(ticketId) {
        return this.dao.findByIdAndUpdate(ticketId, {
            status: "cancelled",
            cancelledAt: new Date()
        }, { new: true });
    }

    async findByEvent(eventId) {
        return this.dao.find({ event: eventId });
    }
}

export const ticketRepository = new TicketRepository(ticketDAO);