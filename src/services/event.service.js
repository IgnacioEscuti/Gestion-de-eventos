import { eventRepository } from "../repositories/event.repository.js";


export class EventService {
    constructor(repository) {
        this.repository = repository
    }

    async createEvent(data, organizerId) {
        const newEvent = await this.repository.create({
            ...data,
            organizer: organizerId
        })
        return newEvent;
    }

    async getPublishedEvents() {
        return this.repository.find({ status: "published" });
    }

    async modifyEvent(eventId, userId, userRole, data){
        const getEvent = await this.repository.findById(eventId)
        if(!getEvent){
            const error = new Error("no existe el evento")
            error.statusCode = 404;
            throw error;
        }

        const isOwner = getEvent.organizer.toString() === userId;
        const isAdmin = userRole === "admin"
        if(!isOwner && !isAdmin){
            const error = new Error("no tenes permiso para modificar el evento")
            error.statusCode = 403;
            throw error;
        }

        const updatedEvent = await this.repository.findByIdAndUpdate(eventId, data);

        return updatedEvent;
    }
}

export const eventService = new EventService(eventRepository);