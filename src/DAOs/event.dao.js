import { eventModel } from "../models/event.model.js";


export class EventDAO {
    async create(data) {
        return eventModel.create(data);
    }

    async findById(id) {
        return eventModel.findById(id);
    }

    async find(filters, page = 1, limit = 10, sort = "date") {
        const skip = (page - 1) * limit;
        return eventModel.find(filters).sort(sort).skip(skip).limit(limit);
    }

    async count(filters) {
    return eventModel.countDocuments(filters);
}

    async findByOrganizer(organizerId) {
        return eventModel.find({ organizer: organizerId });
    }

    async findByIdAndUpdate(id, data) {
        return eventModel.findByIdAndUpdate(id, data, { new: true });
    }

    async updateManyExpired(filters, data) {
        return eventModel.updateMany(filters, data);
    }
}