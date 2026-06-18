import { Schema, model } from "mongoose";

const userSchema = new Schema({

    email:{
        type: String,
        unique: true,
        required: true
    },

    password:{
        type: String,
        required:true
    },

    role:{
        type: String,
        enum: ["admin", "user"],
        default:"user"
    }

})

export const userModel = model("user", userSchema);