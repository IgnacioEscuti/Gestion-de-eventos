import {connectDB} from "./config/database.js"
import { env } from "./config/env.js"
import app from "./app.js"



try {
    await connectDB();
    console.log("OK DB");
    app.listen(env.PORT, () => {
        console.log(`Server online port ${env.PORT}`);
    });
} catch (err) {
    console.error("Error DB:", err);
}


