import express from "express"
import userRouter from "./routes/user.routes.js"
import ticketRouter from "./routes/ticket.routes.js"
import eventRouter from "./routes/event.routes.js"
import sessionRouter from "./routes/session.routes.js"


const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/health", (req, res) =>{
    res.json({status:"ok"});
});

app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/events", eventRouter);
app.use("/api/sessions", sessionRouter);

export default app;

