import { userRepository } from "../repositories/user.repository.js";


export class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllUsers() {
        return  this.repository.find();
    }
}

export const userService = new UserService(userRepository);