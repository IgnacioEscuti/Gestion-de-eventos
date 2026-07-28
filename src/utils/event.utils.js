


export function validDate(date) {
    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        const error = new Error("la fecha del evento no es válida");
        error.statusCode = 400;
        throw error;
    }
    if (eventDate <= new Date()) {
        const error = new Error("la fecha del evento debe ser futura");
        error.statusCode = 400;
        throw error;
    }
}

export function validCapacity(capacity) {
    if (capacity <= 0) {
        const error = new Error("la capacidad debe ser mayor a 0");
        error.statusCode = 400;
        throw error;
    }
}

export function validPrice(price) {
    if (price < 0) {
        const error = new Error("el precio no debe ser negativo");
        error.statusCode = 400;
        throw error;
    }
}

export function validEvent(event) {
    if (!event) {
        const error = new Error("no existe el evento");
        error.statusCode = 404;
        throw error;
    }
}

export function validOwnership(event, userId, userRole) {
    const isOwner = event.organizer.toString() === userId;
    const isAdmin = userRole === "admin"
    if (!isOwner && !isAdmin) {
        const error = new Error("no tenes permiso para modificar el evento")
        error.statusCode = 403;
        throw error;
    }
}

export function validEventEditable(event) {
    const now = new Date();

    if (event.status === "cancelled" || event.status === "finished") {
        const error = new Error("no se puede modificar un evento cancelado o finalizado");
        error.statusCode = 400;
        throw error;
    }

    if (event.date <= now) {
        const error = new Error("no se puede modificar un evento que ya finalizó");
        error.statusCode = 400;
        throw error;
    }
}

