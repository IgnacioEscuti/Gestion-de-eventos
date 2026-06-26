import { userRepository } from "../repositories/repositories.js";
import { createHash, isValidPassword } from "../utils/utils.js";



export class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async register(data) {
        const { email, password } = data;

        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            throw new Error("el usuario ya existe");
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
            role: newUser.role,
        }
        return sessionData;
        
    }


    async login(data) {
        const { email, password } = data;

        const findByEmail = await this.repository.findByEmail(email);
        if (!findByEmail) {
            throw new Error("el usuario no existe")
        }
        const validatePassword = await isValidPassword(password, findByEmail.password);
        if (!validatePassword) {
            throw new Error("la contraseña es incorrecta")
        }
        const sessionData = {
            email: findByEmail.email,
            role: findByEmail.role
        }
        return sessionData;
    }
}

export const userService = new UserService(userRepository);
