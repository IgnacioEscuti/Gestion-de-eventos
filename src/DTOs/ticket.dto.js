import { EventDTO } from "./event.dto.js";

export class TicketDTO {
    constructor(ticket) {
        this.id = ticket.id ?? ticket._id;
        this.user = ticket.user;
        this.event = new EventDTO(ticket.event);
        this.status = ticket.status;
        this.quantity = ticket.quantity;
        this.reservationCode = ticket.reservationCode;
        this.cancelledAt = ticket.cancelledAt;
    }
}
