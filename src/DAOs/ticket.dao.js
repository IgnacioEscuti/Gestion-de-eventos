import { ticketModel } from "../models/ticket.model.js";


export class TicketDAO {
    async create(data) {
        const ticket = await ticketModel.create(data);
        return ticket.populate("event", "title date location");
    }

    async findOne(data) {
        return ticketModel.findOne(data);
    }

    async find(data) {
        return ticketModel.find(data).populate("event", "title date location");
    }

    async findById(id) {
        return ticketModel.findById(id).populate("event", "title date location");
    }

    async findByIdAndUpdate(id, data) {
        return ticketModel.findByIdAndUpdate(id, data, { new: true }).populate("event", "title date location");
    }
}