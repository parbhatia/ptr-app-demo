const winston = require("winston")
require("winston-daily-rotate-file")

var rotationTransport = new winston.transports.DailyRotateFile({
  filename: "logs/archives/%DATE%.log",
  datePattern: "YYYY-MM-DD-HH:mm:ss",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  frequency: "3h",
})

const logger = winston.createLogger({
  // level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.label({ label: "PTR_API_BACKEND" }),
    winston.format.printf(
      (i) => `${i.label} ${i.level} | ${i.timestamp} | ${i.message}`,
    ),
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    //seperate error file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxSize: 10000000,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/http.log",
      level: "http",
      maxSize: 10000000,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/warn.log",
      level: "warn",
      maxSize: 10000000,
      maxFiles: 5,
    }),
    //display to console
    // new winston.transports.Console({
    //   level: "debug",
    //   handleExceptions: true,
    //   colorize: false,
    // }),
    //info and lower levels get combined
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
      maxFiles: 5,
      maxSize: 10000000,
      colorize: false,
      handleExceptions: true,
    }),
    rotationTransport,
  ],
})

module.exports = logger
