import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Levels: error, warn, info, verbose, debug, silly
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors
    new transports.File({ filename: "logs/combined.log" }), // Logs all levels
  ],
});

// Export the logger for use across the app
export default logger;
