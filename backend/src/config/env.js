import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing Environment Variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",

  FRONTEND_URL:
    process.env.FRONTEND_URL || "https://sms-hindi-shayari-api.onrender.com"
};
