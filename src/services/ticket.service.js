import { ticketRepository } from "../repositories/ticket.repository.js";
import { eventService } from "../services/event.service.js"
import { userRepository } from "../repositories/user.repository.js"
import { validExistTicket, validStatusTicket, generateTicketCode, validTicket, validTicketCancellable, validTicketOwnership, validQuantity, validAvailableCapacity } from "../utils/ticket.utils.js";
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
            exists = await this.ticketRepository.findOne({ reservationCode: code });
        }

        return code;
    }


    async createTicket(userId, eventId, quantity) {
        validQuantity(quantity);

        const event = await this.eventService.getEventById(eventId);
        validStatusTicket(event.status);

        const existingTicket = await this.ticketRepository.findActiveTicket(userId, eventId);
        validExistTicket(existingTicket);

        const occupiedSpots = await this.ticketRepository.countActiveTickets(eventId);
        validAvailableCapacity(event.capacity, occupiedSpots, quantity);

        let newTicket;
        const code = await this.generateUniqueCode();
        try {
            newTicket = await this.ticketRepository.create({
                user: userId,
                event: eventId,
                quantity,
                reservationCode: code
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
                ticketCode: newTicket.reservationCode
            });
        } catch (error) {
            console.error("Error al enviar el mail de confirmación:", error.message);
        }

        return newTicket;
    }


    async getTicketById(id, userId, userRole) {
        let ticket;
        try {
            ticket = await this.ticketRepository.findById(id);
        } catch (error) {
            handleMongooseError(error);
        }
        validTicket(ticket);

        const isOwner = ticket.user.toString() === userId;
        const isAdmin = userRole === "admin";

        if (!isOwner && !isAdmin) {
            if (userRole !== "organizer") {
                const error = new Error("no tenes permiso para ver este ticket");
                error.statusCode = 403;
                throw error;
            }
            const event = await this.eventService.getEventById(ticket.event._id);
            validOwnership(event, userId, userRole);
        }

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

    async getAllTickets(filters, userId, userRole) {
        let queryFilters = filters;

        if (userRole === "organizer") {
            const organizerEvents = await this.eventService.getEventsByOrganizer(userId);
            const eventIds = organizerEvents.map(event => event._id);
            queryFilters = { ...filters, event: { $in: eventIds } };
        }

        try {
            return await this.ticketRepository.find(queryFilters);
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
            return await this.ticketRepository.cancelTicket(ticketId);
        } catch (error) {
            handleMongooseError(error);
        }
    }

    async getTicketsByEvent(eventId, userId, userRole) {
        const event = await this.eventService.getEventById(eventId);
        validOwnership(event, userId, userRole);
        return this.ticketRepository.findByEvent(eventId);
    }
}


export const ticketService = new TicketService(ticketRepository, eventService, userRepository);

