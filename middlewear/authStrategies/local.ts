
import * as Express from 'express'
import * as LocalStrategy from 'passport-local'
import { FindOptions } from 'sequelize'

// Model
import User from '../../model/user'

// Controller
import UserController from '../../controllers/user'

// Logger
import Logger from '../../utils/logger'
import RequestError from '../../utils/error'
import { Request } from 'supertest';

class LocalAuthStrategy {
	public Options: LocalStrategy.IStrategyOptionsWithRequest = {
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}

	public authenticate = (req: Express.Request, email: string, password: string, done: Function) => {
		try {
			UserController.authenticateUser(req, email, password, done)
		} catch (err) {
			Logger.error(err)
		}
	}
}

const strategy = new LocalAuthStrategy
export default new LocalStrategy.Strategy(strategy.Options, strategy.authenticate)