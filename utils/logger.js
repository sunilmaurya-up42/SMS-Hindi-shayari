const fs = require("fs");
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({
        stack: true
    }),
    winston.format.printf(info => {
        const stack = info.stack ? `\n${info.stack}` : "";
        return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}${stack}`;
    })
);

const consoleTransport = new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.colorize(),
        logFormat
    )
});

const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "info"
});

const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "60d",
    level: "error"
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        consoleTransport,
        combinedTransport,
        errorTransport
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, "exceptions-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "90d"
        })
    ],
    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, "rejections-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "90d"
        })
    ],
    exitOnError: false
});

logger.stream = {
    write(message) {
        logger.info(message.trim());
    }
};

logger.request = (req) => {
    logger.info(
        `${req.method} ${req.originalUrl} | IP: ${req.ip} | User: ${req.user ? req.user._id : "Guest"}`
    );
};

logger.auth = (message, userId = "Guest") => {
    logger.info(`[AUTH] ${message} | User: ${userId}`);
};

logger.security = (message, ip = "Unknown") => {
    logger.warn(`[SECURITY] ${message} | IP: ${ip}`);
};

logger.database = (message) => {
    logger.info(`[DATABASE] ${message}`);
};

logger.api = (message) => {
    logger.info(`[API] ${message}`);
};

logger.errorLog = (error) => {
    if (error instanceof Error) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
};

module.exports = logger;
