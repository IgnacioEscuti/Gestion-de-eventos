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
}

export const ticketRepository = new TicketRepository(ticketDAO);