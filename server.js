/**
 * ============================================================
 * SMS Hindi Shayari
 * Production Ready Server
 * Author: Sunil Maurya
 * ============================================================
 */

require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

/**
 * Connect MongoDB
 */
const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();

/**
 * Handle Promise Rejections
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:");
  console.error(err);

  server.close(() => {
    process.exit(1);
  });
});

/**
 * Handle Uncaught Exceptions
 */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:");
  console.error(err);

  process.exit(1);
});

/**
 * Graceful Shutdown
 */
process.on("SIGINT", () => {
  console.log("\nStopping Server...");
  server.close(() => {
    console.log("Server Stopped");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\nServer Terminated");
  server.close(() => {
    process.exit(0);
  });
});
