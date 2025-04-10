const winston = require('winston');
require('winston-daily-rotate-file');
const morgan = require('morgan');

const logRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '10m',
  maxFiles: '15d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [logRotateTransport],
});

module.exports = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});