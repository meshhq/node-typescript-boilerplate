import * as Winston from 'winston'
import { existsSync, mkdirSync } from 'fs'
import * as Path from 'path'
const LOG_DIR = 'logs'
const APP_DIR = Path.resolve(__dirname).split('/config')[0]

// Helper method for setting up logger transports
const setLoggerTransports = () => {
	const transports = [
		new Winston.transports.Console({
			colorize: true,
			handleExceptions: true,
			json: false,
			level: 'debug',
		})
	]
	// Check to see if log directory and file exists
	if (!existsSync(LOG_DIR)) {
		mkdirSync(LOG_DIR)
	}
	const fileTransport = new Winston.transports.File({
		colorize: false,
		filename: `./${LOG_DIR}/all-logs.log`,
		handleExceptions: true,
		json: true,
		level: 'info',
		maxFiles: 5,
		maxsize: 10485760
	})
	transports.push(fileTransport as any)
	return transports
}

const logger = new Winston.Logger({
	emitErrs: true,
	exitOnError: false,
	transports: setLoggerTransports()
})

export default class Logger {
	public static info(msg: string, ...meta: any[]) {
		if (process.env.LOGGER_DISABLED) {
			return
		}
		const logLine = Logger.reportLogLine()
		logger.info(`${logLine}: ${msg}`, ...meta)
	}

	public static trace(msg: string, ...meta: any[]) {
		if (process.env.LOGGER_DISABLED) {
			return
		}
		const err: Error = new Error()
		const logLine = Logger.reportLogLine(err)
		logger.info(`${logLine}: ${msg}`, ...meta, 'Trace: ', err.stack)
	}

	public static error(msg: string, ...meta: any[]) {
		if (process.env.LOGGER_DISABLED) {
			return
		}
		const err: Error = new Error()
		const logLine = Logger.reportLogLine(err)
		logger.error(`${logLine}: ${msg}`, ...meta)
	}

	public static handleError(err: Error): string {
		if (err.stack) {
			return ' with ' + err.stack
		} else {
			return ' with ' + err + 'No stack trace available for Error'
		}
	}

	/**
	 * Reports the log line of the calling error
	 * @param errStack
	 */
	private static reportLogLine(errStack = new Error()) {
		try {
			const stack = errStack.stack as string
			const topStack = stack.split('at ')[3]
			const location = topStack.split(APP_DIR)
			const fileLoc = location[location.length - 1]
			const cleanLoc = fileLoc.split(')')
			const trailingNumParts = cleanLoc[0].split(':')
			const trailingNum = trailingNumParts[trailingNumParts.length - 1]
			const cleanWOutTrailingNum = cleanLoc[0].split(`:${trailingNum}`)
			return cleanWOutTrailingNum[0]
		} catch (e) {
			return ''
		}
	}
}

export const stream = {
	write: (message: string, encoding: any) => {
		logger.info(message)
	}
}
