import mongoose from "mongoose";
import config from "config";
import logger from "@utils/logger";

export async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(dbUri);
    logger.info("DB connected");
  } catch (error) {
    logger.error("Could not connect to db");
    logger.error(error);
    process.exit(1);
  }
}

export async function disconnect() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.error("DB disconnect error");
    logger.error(error);
    process.exit(1);
  }
}
