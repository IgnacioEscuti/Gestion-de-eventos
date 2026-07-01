import { userRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js"



export class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(data) {
        const { email, password } = data;

        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            const error = new Error("el usuario ya existe");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await createHash(password);

        const newUser = await this.repository.create({
            ...data,
            password: hashedPassword,
            role: "user"
        });

        const sessionData = {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
        }
        return sessionData;

    }


    async login(data) {
        const { email, password } = data;

        const findByEmail = await this.repository.findByEmail(email);
        if (!findByEmail) {
            throw new Error("Credenciales inválidas")
        }

        const validatePassword = await isValidPassword(password, findByEmail.password);
        if (!validatePassword) {
            throw new Error("Credenciales inválidas")
        }

        const tokenUser = {
            id: findByEmail.id,
            email: findByEmail.email,
            role: findByEmail.role
        }

        const token = generateToken(tokenUser)

        const sessionData = {
            email: findByEmail.email,
            role: findByEmail.role,
            token: token
        }
        return sessionData;
    }
}

export const userService = new UserService(userRepository);
