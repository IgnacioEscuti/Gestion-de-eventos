import { eventService } from "../services/event.service.js";



export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventService.createEvent(req.body, req.user.id)
        res.status(201).json({ message: "Evento creado exitosamente" });
    }
    catch (error) {
        next(error);
    }
}


export async function getAllEvents(req, res, next) {
    try {
        const getEvents = await eventService.getPublishedEvents();
        res.status(200).json({ events: getEvents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function modifyEvent(req, res, next) {
    try {
        const updatedEvent = await eventService.modifyEvent(req.params.id, req.user.id, req.user.role, req.body)
        res.status(200).json({ event: updatedEvent });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

