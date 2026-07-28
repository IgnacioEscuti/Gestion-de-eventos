import { eventService } from "../services/event.service.js";



export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventService.createEvent(req.body, req.user.id)
        res.status(201).json({ event: newEvent });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}


export async function getEvent(req, res) {
    try {
        const getEvent = await eventService.getEventById(req.params.id);
        res.status(200).json({ event: getEvent });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export async function getAllEvents(req, res, next) {
    try {
        const result = await eventService.getEvents(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
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
