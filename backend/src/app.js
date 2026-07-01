import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app = express();

// Security
app.use(helmet());

// Compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SMS Hindi Shayari API",
    version: "v1.0.0",
    status: "Running"
  });
});

// Health Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    version: "v1",
    uptime: process.uptime()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;
