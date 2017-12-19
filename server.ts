// External Deps
import * as express from 'express'

// Config
import Config from './middlewear/app'

// Logger
import Logger from './utils/logger'

// Routes
import Router from './routes'

// Needed for our ORM
import "reflect-metadata";

/**
 * Flagging app start and exit
 */
Logger.info(`Node Process Started`)
process.on('exit', (code: number) => {
	Logger.info(`About to exit process with code: ${code}`)
})

/** The server. */
export default class Server {
	// Configure ENVs

	/** Bootstrap the application. */
	public static bootstrap(): express.Express {
		return new Server().app
	}

	public app: express.Express

	/** Constructor. */
	constructor() {
		// Generate Base Express App
		this.app = express()

		// Configure Server App
		Config.configureApplication(this.app)

		// Mount Routes
		Router.mountRoutes(this.app)
	}
}
