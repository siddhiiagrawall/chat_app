import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Get collections
        const User = conn.connection.collection('users');
        const Message = conn.connection.collection('messages');

        // Delete all documents
        await User.deleteMany({});
        console.log("All users deleted.");

        await Message.deleteMany({});
        console.log("All messages deleted.");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

clearDatabase();
