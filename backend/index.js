// const express = require('express')
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import express from "express"; // Keep express import for middleware

dotenv.config();

const PORT = process.env.PORT || 8080;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOption));

// routes
app.use("/api/v1/user", userRoute); // http://localhost:8080/api/v1/user/register
app.use("/api/v1/message", messageRoute); // http://localhost:8080/api/v1/message/send/:id

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Connect to DB first, then start the server. If DB connection fails, exit.
(async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server due to DB connection error');
        process.exit(1);
    }
})();