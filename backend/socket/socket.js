import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/userModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId);

    if (userId && userId !== 'undefined') {
        userSocketMap[userId] = socket.id;

        // Update lastSeen to now (user is online)
        try {
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        } catch (err) {
            console.error('Error updating lastSeen:', err);
        }
    }

    console.log('Online users:', Object.keys(userSocketMap));
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', async () => {
        console.log('User disconnected:', userId);
        delete userSocketMap[userId];

        // Update lastSeen when user disconnects
        if (userId && userId !== 'undefined') {
            try {
                await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
            } catch (err) {
                console.error('Error updating lastSeen:', err);
            }
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })

})

export { app, io, server };

