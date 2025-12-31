// src/utils/logger.ts
import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

/**
 * Custom log format
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
  })
);

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    // File output for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json()
    }),
    // File output for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.json()
    })
  ]
});

// Create logs directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default logger;