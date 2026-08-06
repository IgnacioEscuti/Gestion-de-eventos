import { ticketModel } from "../models/ticket.model.js";


export class TicketDAO {
    create(data) {
        return ticketModel.create(data);
    }

    findOne(data) {
        return ticketModel.findOne(data);
    }

    find(data) {
        return ticketModel.find(data);
    }

    findById(id) {
        return ticketModel.findById(id);
    }

    findByIdAndUpdate(id, data) {
        return ticketModel.findByIdAndUpdate(id, data, { new: true });
    }
}