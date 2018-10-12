"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Winston = require("winston");
const fs_1 = require("fs");
const Path = require("path");
const LOG_DIR = 'logs';
const APP_DIR = Path.resolve(__dirname).split('/config')[0];
const setLoggerTransports = () => {
    const transports = [
        new Winston.transports.Console({
            colorize: true,
            handleExceptions: true,
            json: false,
            level: 'debug',
        })
    ];
    if (!fs_1.existsSync(LOG_DIR)) {
        fs_1.mkdirSync(LOG_DIR);
    }
    const fileTransport = new Winston.transports.File({
        colorize: false,
        filename: `./${LOG_DIR}/all-logs.log`,
        handleExceptions: true,
        json: true,
        level: 'info',
        maxFiles: 5,
        maxsize: 10485760
    });
    transports.push(fileTransport);
    return transports;
};
const logger = new Winston.Logger({
    emitErrs: true,
    exitOnError: false,
    transports: setLoggerTransports()
});
class Logger {
    static info(msg, ...meta) {
        if (process.env.LOGGER_DISABLED) {
            return;
        }
        const logLine = Logger.reportLogLine();
        logger.info(`${logLine}: ${msg}`, ...meta);
    }
    static trace(msg, ...meta) {
        if (process.env.LOGGER_DISABLED) {
            return;
        }
        const err = new Error();
        const logLine = Logger.reportLogLine(err);
        logger.info(`${logLine}: ${msg}`, ...meta, 'Trace: ', err.stack);
    }
    static warn(msg, ...meta) {
        if (process.env.LOGGER_DISABLED) {
            return;
        }
        const err = new Error();
        const logLine = Logger.reportLogLine(err);
        logger.warn(`${logLine}: ${msg}`, ...meta);
    }
    static error(msg, ...meta) {
        if (process.env.LOGGER_DISABLED) {
            return;
        }
        const err = new Error();
        const logLine = Logger.reportLogLine(err);
        logger.error(`${logLine}: ${msg}`, ...meta);
    }
    static handleError(err) {
        if (err.stack) {
            return ' with ' + err.stack;
        }
        else {
            return ' with ' + err + 'No stack trace available for Error';
        }
    }
    static reportLogLine(errStack = new Error()) {
        try {
            const stack = errStack.stack;
            const topStack = stack.split('at ')[3];
            const location = topStack.split(APP_DIR);
            const fileLoc = location[location.length - 1];
            const cleanLoc = fileLoc.split(')');
            const trailingNumParts = cleanLoc[0].split(':');
            const trailingNum = trailingNumParts[trailingNumParts.length - 1];
            const cleanWOutTrailingNum = cleanLoc[0].split(`:${trailingNum}`);
            return cleanWOutTrailingNum[0];
        }
        catch (e) {
            return '';
        }
    }
}
exports.default = Logger;
exports.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};
