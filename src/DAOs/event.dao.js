import { eventModel } from "../models/event.model.js";


export class EventDAO {
    async create(data) {
        return eventModel.create(data);
    }

    async findById(id) {
        return eventModel.findById(id);
    }

    async find(filters) {
        return eventModel.find(filters);
    }

    async findByIdAndUpdate(id, data) {
        return eventModel.findByIdAndUpdate(id, data, { new: true });
    }
}