import express from "express"
import userRouter from "./routes/user.routes.js"
import ticketRouter from "./routes/ticket.routes.js"
import eventRouter from "./routes/event.routes.js"
import sessionRouter from "./routes/session.routes.js"
import cookieParser from "cookie-parser"
import passport from "passport"
import "./config/passport.config.js"
import "./config/cron.config.js"

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/events", eventRouter);
app.use("/api/sessions", sessionRouter);

export default app;

