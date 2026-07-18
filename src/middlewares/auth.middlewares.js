import passport from "passport";

export function authenticateCurrent(req, res, next) {
    passport.authenticate("current", { session: false }, (err, user) => {
        if (err) return res.status(500).json({ error: "Error al validar la sesión" });
        if (!user) return res.status(401).json({ error: "no autenticado" });
        req.user = user;
        next();
    })(req, res, next);
}
