import { ticketRepository, TicketRepository } from "../repositories/ticket.repository.js";
import { eventService } from "../services/event.service.js"
import { userRepository} from "../repositories/user.repository.js"
import { validExistTicket, validStatusTicket, generateTicketCode, validTicket, validTicketCancellable, validTicketOwnership } from "../utils/ticket.utils.js";
import { handleMongooseError } from "../utils/mongooseError.utils.js";
import { validOwnership } from "../utils/event.utils.js";
import { sendTicketConfirmationEmail } from "./mail.service.js";

export class TicketService {
    constructor(ticketRepository, eventService, userRepository) {
        this.ticketRepository = ticketRepository;
        this.eventService = eventService;
        this.userRepository = userRepository;
    }


    async generateUniqueCode() {
        let code;
        let exists = true;

        while (exists) {
            code = generateTicketCode();
            exists = await this.ticketRepository.findOne({ code });
        }

        return code;
    }


async createTicket(userId, eventId) {
    const event = await this.eventService.getEventById(eventId);
    validStatusTicket(event.status);

    const existingTicket = await this.ticketRepository.findOne({
        user: userId,
        event: eventId,
        status: "active"
    });
    validExistTicket(existingTicket);

    let newTicket;
    const code = await this.generateUniqueCode();
    try {
        newTicket = await this.ticketRepository.create({
            user: userId,
            event: eventId,
            code
        });
    }
    catch (error) {
        handleMongooseError(error);
    }

    const user = await this.userRepository.findById(userId);
    const userName = `${user.first_name} ${user.last_name}`;

    try {
        await sendTicketConfirmationEmail({
            to: user.email,
            userName,
            eventTitle: event.title,
            ticketCode: newTicket.code
        });
    } catch (error) {
        console.error("Error al enviar el mail de confirmación:", error.message);
    }

    return newTicket;
}


    async getTicketById(id) {
        let ticket;
        try {
            ticket = await this.ticketRepository.findById(id);
        } catch (error) {
            handleMongooseError(error);
        }
        validTicket(ticket);
        return ticket;
    }

    async getUserTickets(userId) {
        try {
            return await this.ticketRepository.find({ user: userId });
        }
        catch (error) {
            handleMongooseError(error);
        }
    }

    async getAllTickets(tickets) {
        try {
            return await this.ticketRepository.find(tickets);
        }
        catch (error) {
            handleMongooseError(error);
        }
    }

    async cancelTicket(ticketId, userId, userRole) {
        let ticket;
        try {
            ticket = await this.ticketRepository.findById(ticketId);
        } catch (error) {
            handleMongooseError(error);
        }

        validTicket(ticket);
        validTicketOwnership(ticket, userId, userRole);
        validTicketCancellable(ticket);

        try {
            return await this.ticketRepository.findByIdAndUpdate(ticketId, {
                status: "cancelled",
                cancelledAt: new Date()

            });
        } catch (error) {
            handleMongooseError(error);
        }
    }
}


export const ticketService = new TicketService(ticketRepository, eventService, userRepository);