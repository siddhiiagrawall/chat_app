import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Re-throw so callers can decide what to do (exit/retry)
    throw err;
  }
};

export default connectDB;
