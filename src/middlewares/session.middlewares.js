

export async function validateLoginFields(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Faltan credenciales" })
    }
    next();
}


export async function validatePassword(req, res, next) {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: "la contraseña es requerida" });
    }
    if (password.length < 5) {
        return res.status(400).json({ error: "la contraseña debe tener minimo 5 caracteres" });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "la contraseña debe tener al menos una mayúscula" });
    }
    next();
}


export async function validateUser(req, res, next) {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: "Faltan campos por completar" })
    }
    next();
}


export async function validateEmail(req, res, next) {
    const { email } = req.body;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "El email debe cumplir con el formato" });
    }
    next();
}
