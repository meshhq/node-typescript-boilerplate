
import * as Express from 'express'
import * as Passport from 'passport'
import User from '../model/user'

import LocalAuthStrategy from './authStrategies/local'

/**
 * Local Interfaces
 */
type PassportSerializeUserCB<PassportUser, ID> = (err: any, id?: ID) => void
type PassportDeserializeUserCB<PassportUser, ID> = (err: any, user?: PassportUser) => void

export default class PassportMiddleware {
	/**
	 * Mount Passport Strategies
	 */
	public static MountStrategies () {
		Passport.use('local', LocalAuthStrategy)
	}

	public static SetupUserSerializations () {
		Passport.serializeUser((user: User, done: PassportSerializeUserCB<User, number>) => {
			done(null, user.id)
		})

		Passport.deserializeUser((id: number, done: PassportDeserializeUserCB<User, number>) => {
			User.findOneById(id).then((user: User) => {
				return done(null, user)
			})
		})
	}

	/**
	 * Authorization Helper
	 */
	public static ensureAuthenticated (req: Express.Request, res: Express.Response, next: any): void {
		if (req.isAuthenticated()) {
			return next()
		}
		res.sendStatus(401)
	}

	/**
	 * Overrides to allow for extension
	 */
	public static initialize(): Express.Handler {
		let handler = Passport.initialize()
		return handler
	}

	public static session (): Express.Handler {
		return Passport.session()
	}

	public static use (strategy: Passport.Strategy): Passport.Passport {
		return Passport.use(strategy)
	}

	public static useWithStrategy (name: string, strategy: Passport.Strategy): Passport.Passport {
		return Passport.use(name, strategy)
	}
}
