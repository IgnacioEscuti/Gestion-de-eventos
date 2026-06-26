import { userModel } from "../models/user.model.js"

export class UserDAO {

    async create(data) {
        return userModel.create(data)
    }

    async findByEmail(email) {
        return userModel.findOne({ email })
    }

}