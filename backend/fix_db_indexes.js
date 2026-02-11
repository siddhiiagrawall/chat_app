import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Get the users collection
        const User = conn.connection.collection('users');

        // List indexes
        const indexes = await User.indexes();
        console.log("Current Indexes:", indexes);

        // Check if userName_1 exists
        const hasUserNameIndex = indexes.some(idx => idx.name === 'userName_1');

        if (hasUserNameIndex) {
            console.log("Found userName_1 index. Dropping it...");
            await User.dropIndex('userName_1');
            console.log("Index dropped successfully.");
        } else {
            console.log("userName_1 index not found.");
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();
