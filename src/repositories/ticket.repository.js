import { TicketDAO } from "../DAOs/ticket.dao.js";

const ticketDAO = new TicketDAO();

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(data) {
        const ticket = await this.dao.create(data);
        return ticket.populate("event", "title date location");
    }

    async findOne(data) {
        return this.dao.findOne(data);
    }

    async find(userId) {
        return this.dao.find(userId).populate("event", "title date location");
    }

    async findById(id) {
        return this.dao.findById(id).populate("event", "title date location");
    }

    async findByIdAndUpdate(id, data) {
        return this.dao.findByIdAndUpdate(id, data).populate("event", "title date location");
    }

    async findActiveTicket(userId, eventId) {
        return this.dao.findOne({ user: userId, event: eventId, status: "active" });
    }

    async countActiveTickets(eventId) {
        const activeTickets = await this.dao.find({ event: eventId, status: "active" });
        return activeTickets.reduce((total, ticket) => total + ticket.quantity, 0);
    }

    async cancelTicket(ticketId) {
        return this.findByIdAndUpdate(ticketId, {
            status: "cancelled",
            cancelledAt: new Date()
        });
    }

    async findByEvent(eventId) {
        return this.find({ event: eventId });
    }
}

export const ticketRepository = new TicketRepository(ticketDAO);