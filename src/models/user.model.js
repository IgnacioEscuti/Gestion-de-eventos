import { Schema, model } from "mongoose";

const userSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "el formato del email no es vailido"]
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "organizer", "user"],
        default: "user"
    }

},
    {
        timestamps: true
    })

export const userModel = model("user", userSchema);