import { eventRepository } from "../repositories/event.repository.js";


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


export class EventService {
    constructor(repository) {
        this.repository = repository
    }

    async createEvent(data, organizerId) {
        const eventDate = new Date(data.date);

        if (isNaN(eventDate.getTime())) {
            const error = new Error("la fecha del evento no es válida");
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();
        if (eventDate <= now) {
            const error = new Error("la fecha del evento debe ser futura");
            error.statusCode = 400;
            throw error;
        }

        if (data.capacity <= 0) {
            const error = new Error("la capacidad debe ser mayor a 0");
            error.statusCode = 400;
            throw error;
        }

        if (data.price < 0) {
            const error = new Error("el precio no debe ser negativo");
            error.statusCode = 400;
            throw error;
        }

        try {
            return await this.repository.create({
                ...data,
                organizer: organizerId
            });
        } catch (error) {
            handleMongooseError(error);
        }
    }

    async getEventById(id) {
        let getEvent;
        try {
            getEvent = await this.repository.findById(id);
        } catch (error) {
            handleMongooseError(error);
        }
        if (!getEvent) {
            const error = new Error("no existe el evento")
            error.statusCode = 404;
            throw error;
        }
        return getEvent;
    }

    async getEvents(queryParams = {}) {
        const { search, category, location, priceMin, priceMax, dateFrom, dateTo, status, page, limit, sort } = queryParams;

        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 10;

        const filters = { status: status || "published" };

        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }
        if (category) filters.category = category;
        if (location) filters.location = location;

        const dateFilter = {};
        if (dateFrom) dateFilter.$gte = dateFrom;
        if (dateTo) dateFilter.$lte = dateTo;
        if (Object.keys(dateFilter).length > 0) filters.date = dateFilter;

        const priceFilter = {};
        if (priceMin) priceFilter.$gte = priceMin;
        if (priceMax) priceFilter.$lte = priceMax;
        if (Object.keys(priceFilter).length > 0) filters.price = priceFilter;

        const events = await this.repository.find(filters, currentPage, currentLimit, sort);
        const total = await this.repository.count(filters);
        const totalPages = Math.ceil(total / currentLimit);

        return {
            data: events,
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages
        };
    }

    async modifyEvent(eventId, userId, userRole, data) {
        let getEvent;
        try {
            getEvent = await this.repository.findById(eventId);
        } catch (error) {
            handleMongooseError(error);
        }
        if (!getEvent) {
            const error = new Error("no existe el evento")
            error.statusCode = 404;
            throw error;
        }

        const isOwner = getEvent.organizer.toString() === userId;
        const isAdmin = userRole === "admin"
        if (!isOwner && !isAdmin) {
            const error = new Error("no tenes permiso para modificar el evento")
            error.statusCode = 403;
            throw error;
        }

        if (getEvent.status === "cancelled") {
            const error = new Error("no se puede modificar un evento cancelado");
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();
        if (getEvent.date <= now) {
            const error = new Error("no se puede modificar un evento que ya finalizó");
            error.statusCode = 400;
            throw error;
        }

        if (data.capacity !== undefined && data.capacity <= 0) {
            const error = new Error("la capacidad debe ser mayor a 0");
            error.statusCode = 400;
            throw error;
        }

        if (data.price !== undefined && data.price < 0) {
            const error = new Error("el precio no puede ser negativo");
            error.statusCode = 400;
            throw error;
        }

        let eventDate;
        if (data.date) {
            eventDate = new Date(data.date);
            if (isNaN(eventDate.getTime())) {
                const error = new Error("la fecha del evento no es válida");
                error.statusCode = 400;
                throw error;
            }
            if (eventDate <= now) {
                const error = new Error("la nueva fecha del evento debe ser futura");
                error.statusCode = 400;
                throw error;
            }
        }

        const { title, description, category, location, capacity, price } = data;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (location !== undefined) updateData.location = location;
        if (capacity !== undefined) updateData.capacity = capacity;
        if (price !== undefined) updateData.price = price;
        if (eventDate) updateData.date = eventDate;

        try {
            return await this.repository.findByIdAndUpdate(eventId, updateData);
        } catch (error) {
            handleMongooseError(error);
        }
    }

    async changeStatus(eventId, userId, userRole, status) {
        const validStatuses = ["draft", "published", "cancelled", "finished"];
        if (!validStatuses.includes(status)) {
            const error = new Error("estado inválido");
            error.statusCode = 400;
            throw error;
        }

        let getEvent;
        try {
            getEvent = await this.repository.findById(eventId);
        } catch (error) {
            handleMongooseError(error);
        }
        if (!getEvent) {
            const error = new Error("no existe el evento")
            error.statusCode = 404;
            throw error;
        }

        const isOwner = getEvent.organizer.toString() === userId;
        const isAdmin = userRole === "admin";
        if (!isOwner && !isAdmin) {
            const error = new Error("no tenes permiso para modificar el evento")
            error.statusCode = 403;
            throw error;
        }

        if (getEvent.status === "cancelled") {
            const error = new Error("no se puede modificar un evento cancelado");
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();
        const yaFinalizadoOCancelado = getEvent.status === "finished" || getEvent.date <= now;
        if (status === "published" && yaFinalizadoOCancelado) {
            const error = new Error("no se puede publicar un evento finalizado o cancelado");
            error.statusCode = 400;
            throw error;
        }

        try {
            return await this.repository.findByIdAndUpdate(eventId, { status });
        } catch (error) {
            handleMongooseError(error);
        }
    }

    async finishExpiredEvents() {
        const filters = {
            date: { $lt: new Date() },
            status: "published"
        };
        const data = { status: "finished" };
        return this.repository.updateManyExpired(filters, data)
    }
}

export const eventService = new EventService(eventRepository);