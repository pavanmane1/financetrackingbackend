const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Directory where log files are stored (locally)
const logDir = path.join(__dirname, '../logs');

// Create daily rotate transport for info logs
const infoTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // keep logs for 14 days
  level: 'info',
});

// Create daily rotate transport for error logs
const errorTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // keep error logs for 30 days
  level: 'error',
});

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'finance-tracker-api' },
  transports: [infoTransport, errorTransport],
});

// Add console transport depending on environment
if (process.env.NODE_ENV === 'production') {
  // Render or cloud — logs visible in Render dashboard
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
} else {
  // Local development — colorful, easy-to-read console output
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
