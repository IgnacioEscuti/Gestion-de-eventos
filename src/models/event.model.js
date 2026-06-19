import {Schema, model} from "mongoose";


const eventSchema = new Schema({
    name:String,
    date:Date,
    place:String,
    price:Number,
    capacity:Number,
    status:Boolean
});

export const eventModel = model("event", eventSchema);