import mongoose from "mongoose";
import logger from "../config/logger.js";

export const connectDatabase = async (mongoUri) => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(mongoUri, {
      dbName: "sms_hindi_shayari"
    });

    logger.info(
      `MongoDB Connected : ${connection.connection.host}`
    );

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB Reconnected");
    });

    mongoose.connection.on("error", (error) => {
      logger.error(error.message);
    });

  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};
