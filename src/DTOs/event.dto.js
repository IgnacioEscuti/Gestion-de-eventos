export class EventDTO {
    constructor(event) {
        this.id = event.id ?? event._id;
        this.title = event.title;
        this.description = event.description;
        this.category = event.category;
        this.date = event.date;
        this.location = event.location;
        this.price = event.price;
        this.capacity = event.capacity;
        this.status = event.status;
        this.organizer = event.organizer;
    }
}
