import { userService } from "../services/services.js";



export async function register(req, res) {
    try {
        const newUser = await userService.register(req.body);
        res.status(201).json({ newUser });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}


export async function login(req, res, next) {
    try {
        const userLogin = await userService.login(req.body)
        res.status(200).json({ userLogin });

    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}