import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_DB_URI environment variable in .env.local");
}

// Extend the global object to include our cache variable
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Use the correctly named global._mongoose
const cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}