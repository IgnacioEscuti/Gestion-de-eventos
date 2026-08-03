
export class RegisterDTO {
    constructor(data) {
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email.trim().toLowerCase();
        this.password = data.password;
    }
}

export class UserDTO {
    constructor(user) {
        this.id = user.id ?? user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
    }
}
