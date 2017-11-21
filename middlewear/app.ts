// External Deps
import { Express } from 'express'
import * as express from 'express'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as expressSession from 'express-session'
import * as DotENV from 'dotenv'
import * as compression from 'compression'
import * as errorHandler from 'errorhandler'

import PassportMiddleware from './passport'
import CORS from './cors'

// Internal Deps
import { SESSION_PREFIX, SESSION_SECRET } from '../utils/constants'

/** Configure application */
export default class MeshConfig {

	public static configureApplication(app: Express) {

		// Ensure ENVs Set
		DotENV.config()

		// Enable GZIP compression
		app.use(compression())

		// Set Views Path
		app.use(express.static(path.join(__dirname, 'public')))
		app.set('views', path.join(__dirname, 'views'))
		app.set('view engine', 'pug')

		// Setup Logger
		app.use(logger('dev'))

		// mount json form parser
		app.use(bodyParser.json())

		// mount query string parser
		app.use(bodyParser.urlencoded({ extended: true }))

		// catch 404 and forward to error handler
		app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.status(404).send('You found a dead link! Sorry can\'t find that!')
		})

		// initalize passport
		app.use(PassportMiddleware.initialize())
		app.use(PassportMiddleware.session())

		// Setup CORS
		app.use(CORS)

		// error handling
		app.use(errorHandler())
	}
}
