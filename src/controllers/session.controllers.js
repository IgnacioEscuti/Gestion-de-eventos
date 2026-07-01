import { RegisterDTO } from "../DTOs/user.dto.js";
import { userService } from "../services/user.service.js";
import { env } from "../config/env.js"



export async function register(req, res) {
    try {
        const dto = new RegisterDTO(req.body);
        const newUser = await userService.register(dto);
        res.status(201).json({ newUser });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};


export async function login(req, res, next) {
    try {
        const { email, role, token } = await userService.login(req.body)

        res.cookie("currentUser", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "lax"
        })
        res.status(200).json({ email, role });
    }
    catch (error) {
        res.status(401).json({ error: error.message })
    }
};

export async function getCurrentUser(req, res, next) {
    try {
        res.status(200).json({ user: req.user })
    }
    catch (error) {
        res.status(401).json({ error: error.message })
    }
}

export async function logout(req, res, next) {
    try {
        res.clearCookie("currentUser")
        res.status(200).json({ mensaje: "sesion cerrada" })
    }
    catch (error) {
        res.status(401).json({ error: error.message })
    }
}