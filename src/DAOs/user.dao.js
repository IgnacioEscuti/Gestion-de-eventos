import { userModel } from "../models/user.model.js"

export class UserDAO {

    async create(data) {
        return userModel.create(data)
    }

    async findByEmail(email) {
        return userModel.findOne({ email: email.trim().toLowerCase() })
    }

    async find(filters) {
        return userModel.find(filters)
    }

}