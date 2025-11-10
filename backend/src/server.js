import express from "express";
import taskRouters from './routes/tasksRouters.js'
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();

const PORT = process.env.PORT || 5001

const app = express();

app.use(cors({ origin: "http://localhost:5173"}))

app.use(express.json());

app.use("/api/tasks", taskRouters);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server turn on in port ${PORT} nha !`);
    });
});

