// External Dependencies
import { Request, Response } from 'express'
import { Promise as Bluebird } from 'sequelize'

// Models
import User, { UserInterface } from '../model/user'

// Logger
import Logger from '../utils/logger'
import RequestError from '../utils/error'
import Validator from '../utils/validator'

// Acceptable Body Params
const bodyParams = ['email', 'password', 'firstName', 'lastName']
const validator = new Validator(bodyParams)

export default class UserController {

	/**
	 * Authenticates a user.
	 * @param req Express Request
	 * @param req.body The payload containing user information.
	 * @param req.body.email The email address for the user.
	 * @param req.body.password The password address for the user.
	 * @param res Express Response
	 */
	public static authenticateUser = (req: Request, email: string, password: string, done: Function) => {
		// Check for a user with the supplied email.
		Logger.info(`Checking for existing user with email: ${email}`)
		User.findByEmail(email).then((user: User) => {
			if (!user) {
				Logger.warn(`authenticateUser() - User not found for email: ${email}`)
				return done(null, false)
			}

			Logger.info(`Validating password for email: ${req.body.email}`)
			const valid = user.authenticate(password)
			if (!valid) {
				Logger.warn(`authenticateUser() - Invalid password for user: ${email}`)
				return done(null, false)
			}
			done(null, user)
		}).catch((err: Error) => {
			Logger.error('Error in authenticateUser() - ', err)
			const plainError = new Error('Internal server error')
			done(plainError)
		})
	}

	/**
	 * Registers a new User.
	 * @param req Express Request
	 * @param req.body The payload contaning user information.
	 * @param req.body.email The email address for the user.
	 * @param req.body.password The password address for the user.
	 * @param res Express Response
	 */
	public static registerUser = (req: Request, res: Response, next: Function) => {
		const valid = req.body.email && req.body.password
		if (!valid) {
			const err = new RequestError(422, `Failed to register user. Req parameters are invalid.`)
			return RequestError.handle(err, req, res)
		}

		// Check for a user with the supplied email.
		Logger.info(`Checking for existing user with email: ${req.body.email}`)
		User.findByEmail(req.body.email).then((user: User) => {
			if (user) {
				throw new RequestError(401, `Conflict. User with email: ${req.params.user_id} already exists.`)
			}
			Logger.info(`Creating new user with email: ${req.body.email}`)
			const userInfo = UserController.buildUserInfo(req.body)
			return User.register(userInfo)
		}).then((newUser: User) => {
			// Next to pass down the express chain
			next()
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Gets all User for a user constrained by the supplied query parameters.
	 * @param req Express Request
	 * @param req.params.user_id The userID for the user to be fetched.
	 * @param res Express Response
	 */
	public static getUser(req: Request, res: Response) {
		const valid = validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to find user. Req parameters are invalid: ${req}`)
			return RequestError.handle(err, req, res)
		}

		Logger.info(`Fetching user with id: ${req.params.user_id}`)
		User.findById(req.params.user_id).then((user: User) => {
			if (!user) {
				throw new RequestError(404, `Failed to find user with id: ${req.params.user_id}`)
			}
			Logger.info(`Found user: ${user}`)
			res.status(200).json(user)
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Gets all User for a user constrained by the supplied query parameters.
	 * @param req Express Request
	 * @param req.query The query values to be used in the query.
	 * @param res Express Response
	 */
	public static getUsers(req: Request, res: Response) {
		const valid = validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to find users. Req parameters are invalid: ${req}`)
			return RequestError.handle(err, req, res)
		}

		Logger.info('Find all Users for User: ', req.user.githubHandle)
		User.findAll({ where: req.query }).then((users: User[]) => {
			if (users.length === 0) {
				throw new RequestError(404, `Failed to find users for query: ${req.query}`)
			}
			Logger.info(`Found users: ${users} for query: ${req.query} `)
			res.status(200).json(users)
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Updates an User with the supplied information.
	 * @param req Express Request
	 * @param req.params.user_id The user)D for the user to be updated.
	 * @param req.body The paylod containg update information for the user.
	 * @param res Express Response
	 */
	public static async updateUser(req: Request, res: Response) {
		const valid = validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to update user. Req parameters are invalid: ${req}`)
			return RequestError.handle(err, req, res)
		}

		Logger.info(`Updating user with ID ${req.params.user_id}`)
		User.updateById(req.params.user_id, req.body).then((user: User) => {
			if (!user) {
				throw new RequestError(404, `Failed to find user for query: ${req.query}`)
			}
			Logger.info(`Updated User ${user}`)
			res.status(200).json(user)
		}).catch((err: Error | RequestError) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Get a single User the authorized user belongs to
	 * @param req Express Request - will contain the Authorized User info
	 * @param req.params.user_id The userID for the user to be deleted.
	 * @param res Express Response
	 */
	public static async deleteUser(req: Request, res: Response) {
		const valid = validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to delete organizations. Req parameters are invalid: ${req}`)
			return RequestError.handle(err, req, res)
		}

		Logger.info(`Deleting user with ID ${req.params.user_id}`)
		User.destroy({ where: { id: req.params.user_id } }).then((rows: number) => {
			if (rows === 0) {
				throw new RequestError(404, `Failed to delete user with id: ${req.params.user_id}. Not found`)
			}
			Logger.info(`Deleted user with ID: ${req.params.user_id}`)
			res.status(200).json()
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	public static buildUserInfo(body: any): UserInterface {
		return {
			email: body.email,
			password: body.password,
			firstName: body.firstName,
			lastName: body.lastName
		}
	}
}
