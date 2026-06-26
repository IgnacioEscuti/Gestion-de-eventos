import { UserDAO } from "../DAOs/dao.js"


const userDAO = new UserDAO();

export class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(data) {
        return this.dao.create(data)
    }

    async findByEmail(email) {
        return this.dao.findByEmail(email)
    }
}

export const userRepository = new UserRepository(userDAO);