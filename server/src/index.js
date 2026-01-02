import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

import connectDB from "./config/database.js";
import app from './app.js'



const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        })

        const port = process.env.PORT || 8000; // Store it in a variable

        app.listen(port, () => {
            console.log(`Server is actually listening on port ${port}`);
        });
    } catch (error) {
        console.log("MongoDB connection error", error);
    }
};

startServer();