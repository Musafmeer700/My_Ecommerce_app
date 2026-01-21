import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("Connected to Database")
    } catch (error) {
        console.log("error connecting database")
        process.exit(1)
    }
}