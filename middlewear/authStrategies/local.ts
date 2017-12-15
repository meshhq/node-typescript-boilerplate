
import * as Express from 'express'
import * as LocalStrategy from 'passport-local'
import { FindOptions } from 'sequelize'

// Model
import User from '../../model/user'

// Controller
import UserController from '../../controllers/user'

// Logger
import Logger from '../../utils/logger'

class LocalAuthStrategy {

	public Options: LocalStrategy.IStrategyOptionsWithRequest = {
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}

	public authenticate = async (req: Express.Request, email: string, password: string, done: Function) => {
		try {
			UserController.authenticateUser(req, email, password, done)
		} catch (err) {
			Logger.error(`Error in the authenticate() method with user: ${email}`, err)
			done(new Error('Internal server error'))
		}
	}
}

const strategy = new LocalAuthStrategy()
export default new LocalStrategy.Strategy(strategy.Options, strategy.authenticate)
