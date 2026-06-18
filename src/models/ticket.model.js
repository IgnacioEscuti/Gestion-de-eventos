import { Schema, Model, Types } from "mongoose";


const ticketSchema = new Schema({
    user:{
        type: Types.ObjectId,
        ref: "user"
    },
    event:{
        type: Types.ObjectId,
        ref: "event"
    }
})


export const ticketModel = model("ticket", ticketSchema);