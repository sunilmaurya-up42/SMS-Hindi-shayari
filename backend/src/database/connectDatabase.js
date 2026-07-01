import mongoose from "mongoose";

export const connectDatabase = async (mongoUri) => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri);

    console.log("=================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
};
