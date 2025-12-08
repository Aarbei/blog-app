import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // уже подключено
    return mongoose.connection.asPromise();
  }

  if (mongoose.connection.readyState === 2) {
    // подключение в процессе
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env file");
  }

  try {
    return mongoose.connect(uri, {
      dbName: "blog-app",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
