import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("error", (error) => {
      console.log("MongoDB connection error", error);
      process.exit();
    });
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}
