export function validTicket(ticket) {
    if (!ticket) {
        const error = new Error("No existe este ticket");
        error.statusCode = 400;
        throw error;
    }
}

export function validTicketOwnership(ticket, userId, userRole) {
    const isOwner = ticket.user.toString() === userId;
    const isAdmin = userRole === "admin" || userRole === "organizer";
    if (!isOwner && !isAdmin) {
        const error = new Error("no tenes permiso para cancelar este ticket");
        error.statusCode = 403;
        throw error;
    }
}

export function validExistTicket(existingTicket) {
    if (existingTicket) {
        const error = new Error("ya existe un ticket activo para este evento");
        error.statusCode = 400;
        throw error;
    }
}


export function validStatusTicket(status) {
    if (!(status === "published")) {
        const error = new Error("El ticket no pertenece a un evento publicado");
        error.statusCode = 400;
        throw error;
    }
}

export function generateTicketCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export function validTicketCancellable(ticket) {
    if (ticket.status === "cancelled") {
        const error = new Error("este ticket ya fue cancelado");
        error.statusCode = 400;
        throw error;
    }
}