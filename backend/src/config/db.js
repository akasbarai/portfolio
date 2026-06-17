import mongoose from "mongoose";

const isServerless = Boolean(process.env.VERCEL);

function getConnectTimeout() {
  const configuredTimeout = Number(process.env.MONGO_CONNECT_TIMEOUT_MS);
  if (Number.isFinite(configuredTimeout) && configuredTimeout > 0) {
    return configuredTimeout;
  }

  return isServerless ? 5000 : 10000;
}

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("MONGO_URI is not set. Backend is using file-backed fallback data.");
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return true;
  }

  try {
    const timeout = getConnectTimeout();
    await mongoose.connect(uri, {
      maxPoolSize: isServerless ? 5 : 10,
      serverSelectionTimeoutMS: timeout,
      connectTimeoutMS: timeout,
      socketTimeoutMS: 15000
    });
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
