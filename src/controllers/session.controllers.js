import { sessionService } from "../services/session.service.js";
import { env } from "../config/env.js"
import { UserDTO } from "../DTOs/user.dto.js";



export async function register(req, res) {
    const { first_name, last_name, email, role } = new UserDTO(req.user);
    res.status(201).json({ newUser: { first_name, last_name, email, role } });
}


export async function login(req, res, next) {
    try {
        const { email, role, token } = await sessionService.generateSessionToken(req.user);

        res.cookie("currentUser", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "lax"
        })
        res.status(200).json({ email, role });
    }
    catch (error) {
        next(error);
    }
};


export async function getCurrentUser(req, res, next) {
    const { id, email, role } = new UserDTO(req.user);
    res.status(200).json({ id, email, role })
}


export async function logout(req, res, next) {
    res.clearCookie("currentUser")
    res.status(200).json({ mensaje: "sesion cerrada" })
}