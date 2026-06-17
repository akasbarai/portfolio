import mongoose from "mongoose";

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("MONGO_URI is not set. Backend is using file-backed fallback data.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Backend is using file-backed fallback data.");
    console.warn(error.message);
    return false;
  }
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
