import "dotenv/config"

export const env = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}