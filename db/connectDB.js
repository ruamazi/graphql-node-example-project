import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    if (db) {
      console.log("connected to DB");
      return;
    }
    console.log("failed to connect to DB");
  } catch (err) {
    console.log(err);
  }
};
