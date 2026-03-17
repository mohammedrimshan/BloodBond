import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Connection string not loaded");
  }
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected`);
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
