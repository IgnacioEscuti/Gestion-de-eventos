import passport from "passport";

export function authenticateRegister(req, res, next) {
    passport.authenticate("register", { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ error: "Error al registrar el usuario" });
        if (!user) return res.status(409).json({ error: info?.message || "no se pudo registrar el usuario" });
        req.user = user;
        next();
    })(req, res, next);
}

export function authenticateLogin(req, res, next) {
    passport.authenticate("login", { session: false }, (err, user) => {
        if (err) return res.status(500).json({ error: "Error al iniciar sesión" });
        if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
        req.user = user;
        next();
    })(req, res, next);
}

export function authenticateCurrent(req, res, next) {
    passport.authenticate("current", { session: false }, (err, user) => {
        if (err) return res.status(500).json({ error: "Error al validar la sesión" });
        if (!user) return res.status(401).json({ error: "no autenticado" });
        req.user = user;
        next();
    })(req, res, next);
}
