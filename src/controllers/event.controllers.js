
export async function getAllEvents(req, res, next) {
    try {
        res.json([]);
    } catch (error) {
        next(error);
    }
}