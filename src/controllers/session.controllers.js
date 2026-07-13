import { sessionService } from "../services/session.service.js";
import { env } from "../config/env.js"



export async function register(req, res) {
    try {
        const { first_name, last_name, email, role } = req.user;
        res.status(201).json({ newUser: { first_name, last_name, email, role } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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
        res.status(401).json({ error: error.message })
    }
};


export async function getCurrentUser(req, res, next) {
    try {
        const { id, email, role } = req.user;
        res.status(200).json({ id, email, role })
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