import jwt from "jsonwebtoken";
import { env } from "../config/env.js"


export function generateToken(token) {
    return jwt.sign(token, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET)
}