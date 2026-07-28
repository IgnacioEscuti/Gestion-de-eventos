import { ticketModel } from "../models/ticket.model.js";


export class TicketDAO{
    async create(data) {
        return ticketModel.create(data);
    }

    async findOne(data){
        return ticketModel.findOne(data);
    }

    async find(data){
        return ticketModel.find(data);
    }

    async findById(id){
        return ticketModel.findById(id);
    }

    async findByIdAndUpdate(id){
        return ticketModel.findByIdAndUpdate(id);
    }
}