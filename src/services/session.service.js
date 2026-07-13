import { userRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js"



export class SessionService {
    constructor(repository) {
        this.repository = repository; 
    }


    async register(data) {
        const hashedPassword = await createHash(data.password);

        const newUser = await this.repository.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: hashedPassword,
            role: "user"
        });

        return {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        };
    }

//login

    async generateSessionToken(user) {
        const tokenUser = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const token = generateToken(tokenUser)

        const sessionData = {
            email: user.email,
            role: user.role,
            token: token
        }
        return sessionData;
    }
}

export const sessionService = new SessionService(userRepository);
