export function handleMongooseError(error) {
    if (error.statusCode) throw error;

    if (error.name === "CastError") {
        const err = new Error("id de evento inválido");
        err.statusCode = 400;
        throw err;
    }
    if (error.name === "ValidationError") {
        const err = new Error(error.message);
        err.statusCode = 400;
        throw err;
    }
    throw error;
}