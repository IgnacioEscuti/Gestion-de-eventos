import { eventRepository } from "../repositories/event.repository.js";
import { validDate, validCapacity, validPrice, validEvent, validOwnership, validEventEditable } from "../utils/event.utils.js";
import { handleMongooseError } from "../utils/mongooseError.utils.js";

export class EventService {
    constructor(repository) {
        this.repository = repository
    }


    async createEvent(data, organizerId) {
        validDate(data.date);
        validCapacity(data.capacity);
        validPrice(data.price);

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
        validEvent(getEvent);
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

        validEvent(getEvent);
        validOwnership(getEvent, userId, userRole);
        validEventEditable(getEvent);
        if (data.capacity !== undefined) validCapacity(data.capacity);
        if (data.price !== undefined) validPrice(data.price);
        if (data.date !== undefined) validDate(data.date);

        const { title, description, category, location, capacity, price, date } = data;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (location !== undefined) updateData.location = location;
        if (capacity !== undefined) updateData.capacity = capacity;
        if (price !== undefined) updateData.price = price;
        if (date !== undefined) updateData.date = new Date(date);

        try {
            return await this.repository.findByIdAndUpdate(eventId, updateData);
        } catch (error) {
            handleMongooseError(error);
        }
    }


    async getEventsByOrganizer(organizerId) {
        return this.repository.findByOrganizer(organizerId);
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