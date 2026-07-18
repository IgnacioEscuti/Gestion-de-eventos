import {Schema, model} from "mongoose";


const eventSchema = new Schema({
    title: { type: String,
            required: true
            },
    description: { type: String,
            required: true 
        },
    category: { type: String,
            required: true 
        },
    date: { type: Date,
            required: true 
        },
    location: { type: String,
            required: true 
        },
    price: { type: Number,
            required: true 
        },
    capacity: { type: Number,
            required: true 
        },
    status: { type: String,
            enum: ["draft", "published", "cancelled", "finished"],
            required: true 
        },
    organizer: { type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
},    
    {
        timestamps: true
    });


export const eventModel = model("event", eventSchema);