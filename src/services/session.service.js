import { userRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js"
import { UserDTO } from "../DTOs/user.dto.js";



export class SessionService {
    constructor(repository) {
        this.repository = repository; 
    }


    async register(data) {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            const error = new Error("el usuario ya existe");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await createHash(data.password);

        const newUser = await this.repository.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: hashedPassword,
            role: "user"
        });

        return new UserDTO(newUser);
    }

//login

    async generateSessionToken(user) {
        const userDTO = new UserDTO(user);

        const tokenUser = {
            id: userDTO.id,
            email: userDTO.email,
            role: userDTO.role
        }

        const token = generateToken(tokenUser)

        const sessionData = {
            email: userDTO.email,
            role: userDTO.role,
            token: token
        }
        return sessionData;
    }
}

export const sessionService = new SessionService(userRepository);
