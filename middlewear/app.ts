// External Deps
import { Express } from 'express'
import * as express from 'express'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as RedisStore from 'connect-redis'
import * as DotENV from 'dotenv'
import * as compression from 'compression'
import * as errorHandler from 'errorhandler'
import "reflect-metadata";
import { createConnection, Connection } from "typeorm";

import PassportMiddleware from './passport'
import CORS from './cors'
import Redis from '../services/redis'

// Session Config
export const SESSION_SECRET = 'MeshSecret'
export const SESSION_PREFIX = 'MeshSession'

/** Configure application */
export default class MeshConfig {

	public static async configureApplication(app: Express) {

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

		// mount query string parser
		app.use(bodyParser.urlencoded({ extended: true }))

		// mount json form parser
		app.use(bodyParser.json())

		// catch 404 and forward to error handler
		app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
			res.status(404).send('You found a dead link! Sorry can\'t find that!')
		})

		// Express Session
		const redisSessionStore = RedisStore(session)
		const sessiontOpts: session.SessionOptions = {
			resave: false,
			saveUninitialized: true,
			secret: SESSION_SECRET,
			store: new redisSessionStore({
				client: Redis.RedisClient(),
				prefix: SESSION_PREFIX
			})
		}

		// Mount the session tracking
		app.use(session(sessiontOpts))

		// initalize passport
		app.use(PassportMiddleware.initialize())
		app.use(PassportMiddleware.session())
		PassportMiddleware.MountStrategies()
		PassportMiddleware.SetupUserSerializations()

		// Setup CORS
		app.use(CORS)

		// error handling
		app.use(errorHandler())
	}
}
