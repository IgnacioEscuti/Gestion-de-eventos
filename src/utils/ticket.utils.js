export function validTicket(ticket) {
    if (!ticket) {
        const error = new Error("No existe este ticket");
        error.statusCode = 400;
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
    if (!(status === "published")){
        const error = new Error("El ticket no pertenece a un evento publicado");
        error.statusCode = 400;
        throw error;
    }
}

export function generateTicketCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}