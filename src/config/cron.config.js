import cron from "node-cron";
import { eventService } from "../services/event.service.js";

cron.schedule("0 * * * *", async () => {
    try {
        await eventService.finishExpiredEvents();
        console.log("Eventos vencidos actualizados a finished");
    } catch (error) {
        console.error("Error al actualizar eventos vencidos:", error.message);
    }
});