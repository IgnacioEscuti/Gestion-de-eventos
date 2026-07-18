import { EventDAO } from "../DAOs/event.dao.js"


const eventDAO = new EventDAO();

export class EventRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(data) {
        return  this.dao.create(data);
    }

    async findById(id) {
        return this.dao.findById(id);
    }

    async find(filters) {
        return this.dao.find(filters);
    }

    async findByIdAndUpdate(id, data) {
        return this.dao.findByIdAndUpdate(id, data, { new: true });
    }
}

export const eventRepository = new EventRepository(eventDAO)