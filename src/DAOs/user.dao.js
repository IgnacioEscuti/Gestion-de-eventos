import { userModel } from "../models/user.model.js"

export class UserDAO {

    async create(data) {
        return userModel.create(data);
    }

    findByEmail(email) {
        return userModel.findOne({ email: email.trim().toLowerCase() });
    }

    async find(filters) {
        return userModel.find(filters);
    }

    async findById(id) {
        return userModel.findById(id)
    };
}
