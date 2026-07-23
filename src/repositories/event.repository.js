import { EventDAO } from "../DAOs/event.dao.js"


const eventDAO = new EventDAO();

export class EventRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(data) {
        return this.dao.create(data);
    }

    async findById(id) {
        return this.dao.findById(id);
    }

    async find(filters, page, limit, sort) {
        return this.dao.find(filters, page, limit, sort);
    }

    async count(filters) {
        return this.dao.count(filters);
    }

    async findByIdAndUpdate(id, data) {
        return this.dao.findByIdAndUpdate(id, data, { new: true });
    }

    async updateManyExpired(filters, data) {
        return this.dao.updateManyExpired(filters, data);
    }
}

export const eventRepository = new EventRepository(eventDAO)