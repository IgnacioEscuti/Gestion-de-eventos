import { TicketRepository } from "../repositories/ticket.repository.js";

function handleMongooseError(error) {
    if (error.statusCode) throw error;

    if (error.name === "CastError") {
        const err = new Error("id de evento inválido");
        err.statusCode = 400;
        throw err;
    }
    if (error.name === "ValidationError") {
        const err = new Error(error.message);
        err.statusCode = 400;
        throw err;
    }
    throw error;
}

export class TicketService {
    constructor(repository) {
        return this.repository = repository
    }


    async getTicket() {
        const existingTicket = await this.repository.findOne({
            user: userId,
            event: eventId,
            status: 'active'
        })
        if (existingTicket){
            const error = new Error("Ya existe este ticket");
            error.statusCode = 400;
            throw error;
        }
            

    }

    async createTicket() {

    }
}