import { eventService } from "../services/event.service.js";
import { EventDTO } from "../DTOs/event.dto.js";



export async function createEvent(req, res, next) {
    try {
        const newEvent = await eventService.createEvent(req.body, req.user.id)
        res.status(201).json({ event: new EventDTO(newEvent) });
    } catch (error) {
        next(error);
    }
}


export async function getEvent(req, res, next) {
    try {
        const getEvent = await eventService.getEventById(req.params.id);
        res.status(200).json({ event: new EventDTO(getEvent) });
    } catch (error) {
        next(error);
    }
}

export async function getAllEvents(req, res, next) {
    try {
        const result = await eventService.getEvents(req.query);
        res.status(200).json({
            ...result,
            data: result.data.map(event => new EventDTO(event))
        });
    } catch (error) {
        next(error);
    }
}


export async function modifyEvent(req, res, next) {
    try {
        const updatedEvent = await eventService.modifyEvent(req.params.id, req.user.id, req.user.role, req.body)
        res.status(200).json({ event: new EventDTO(updatedEvent) });
    } catch (error) {
        next(error);
    }
}


export async function changeEventStatus(req, res, next) {
    try {
        const updatedEvent = await eventService.changeEventStatus(req.params.id, req.user.id, req.user.role, req.body.status)
        res.status(200).json({ event: new EventDTO(updatedEvent) });
    } catch (error) {
        next(error);
    }
}
