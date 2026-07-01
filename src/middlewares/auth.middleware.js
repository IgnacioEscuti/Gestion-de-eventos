import { verifyToken } from "../utils/jwt.js";


export function authMiddleware(req, res, next) {
    const token = req.cookies.currentUser;
    if (!token) {
        return res.status(401).json({ error: "no autenticado" });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "token inválido o expirado" });
    }
}