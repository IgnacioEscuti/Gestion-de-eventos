
export class RegisterDTO {
    constructor(data) {
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email.trim().toLowerCase();
        this.password = data.password;
    }
}
