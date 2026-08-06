import { UserDAO } from "../DAOs/user.dao.js"


const userDAO = new UserDAO();

export class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(data) {
        return this.dao.create(data)
    }

    async findByEmail(email) {
        return this.dao.findByEmail(email).select("+password")
    }

    async find(filters) {
        return this.dao.find(filters)
    }

    async findById(id) {
        return this.dao.findById(id);
    }
}

export const userRepository = new UserRepository(userDAO);