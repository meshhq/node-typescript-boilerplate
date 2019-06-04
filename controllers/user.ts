// External Dependencies
import { Request, Response } from 'express'

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
	 * @param email The email for the user attempting to authenticate.
	 * @param password The password for the user attempting to authenticate.
	 * @param dones
	 */
	public static authenticateUser = (req: Request, email: string, password: string, done: Function) => {
		// Check for a user with the supplied email.
		Logger.info(`Checking for existing user with email: ${email}`)
		User.findByEmail(email).then((user: User) => {
			if (!user) {
				Logger.info(`Failed to find user with email: ${email}`)
				return done()
			}
			Logger.info(`Validating password for email: ${req.body.email}`)
			const valid = user.authenticate(password)
			if (!valid) {
				Logger.info(`Failed to authenticate user with email: ${email}`)
				return done()
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
			const newUser = UserController.buildUser(req.body)
			return newUser.register(req.body.password)
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
		User.findOneById(req.params.user_id).then((user: User) => {
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
	 * Gets all Users for a user constrained by the supplied query parameters.
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
		User.find({ where: req.query }).then((users: User[]) => {
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
	 * Gets list of Users.
	 * @param req Express Request
	 * @param req.query The query values to be used in the query.
	 * @param res Express Response
	 */
	public static getListOfUsers(req: Request, res: Response) {
		const valid = validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to find users.`)
			return RequestError.handle(err, req, res)
		}
		Logger.info('Find all Users: ')
		User.find({}).then((users: User[]) => {
			Logger.info(`Found users: ${users}`)
			res.status(200).json(users)
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Creates a new User.
	 * @param req Express Request
	 * @param req.body The payload containing user information.
	 * @param req.body.firstName The first name for the user.
	 * @param req.body.lastName The last name for the user.
	 * @param email User's email
	 * @param res Express Response
	 */
	public static createUser = (req: Request, res: Response) => {
		const firstName = req.body.firstName
		const lastName = req.body.lastName
		const email = req.body.email
		if (!firstName || !lastName || !email) {
			const err = new RequestError(422, `Failed to create user. All parameters are required.`)
			return RequestError.handle(err, req, res)
		}

		// Check for a user with the supplied email.
		Logger.info(`Checking for existing user with email: ${email} `)
		User.findEmail(email).then((user: User) => {
			if (user) {
				throw new RequestError(401, `Conflict. User with email: ${email} already exists.`)
			}
			Logger.info(`Creating new user with email: ${req.body.email}`)
			const newUser = UserController.buildUser(req.body)
			return newUser.save()
		}).then((user: User) => {
			Logger.info(`Save User with Email ${email}`)
			res.status(201).json(user)
		}).catch((err: Error) => {
			RequestError.handle(err, req, res)
		})
	}

	/**
	 * Updates an User with the supplied information.
	 * @param req Express Request
	 * @param req.params.user_id The userID for the user to be updated.
	 * @param req.body The paylod containg update information for the user.
	 * @param res Express Response
	 */
	public static async updateUser(req: Request, res: Response) {
		const valid = req.params.user_id && validator.ValidateRequest(req)
		if (!valid) {
			const err = new RequestError(422, `Failed to update user.Req parameters are invalid: ${req} `)
			return RequestError.handle(err, req, res)
		}
		Logger.info(`Updating user with ID ${req.params.user_id} `)
		User.updateById(req.params.user_id, req.body)
			.then(() => {
				Logger.info(`Updated User with ID ${req.params.user_id} `)
				return User.findOneById(req.params.user_id)
			}).then((user: any) => {
				// tslint:disable-next-line:no-console
				console.log('UPDATED ORG : ', user)
				res.status(200).json(user)
			})
			.catch((err: Error | RequestError) => {
				Logger.error('Failed updating user.')
				RequestError.handle(err, req, res)
			})
	}

	/**
	 * Get a single User the authorized user belongs to
	 * @param req Express Request - will contain the Authorized User info
	 * @param req.params.user_id The userID for the user to be deleted.
	 * @param res Express Response
	 */
#	public static async deleteUser(req: Request, res: Response) {
		Logger.info(`Fetching user with id: ${req.params.user_id} `)
		User.findOneById(req.params.user_id).then((user: User) => {
			if (!user) {
				throw new RequestError(404, `Failed to find user with id: ${req.params.user_id} `)
			}
			Logger.info(`Deleting user with ID ${req.params.user_id} `)
			User.removeById(req.params.user_id)
		}).then(() => {
			Logger.info(`Deleted user with ID: ${req.params.user_id} `)
			res.status(200).json({})
		}).catch((err: Error) => {
			Logger.error('Failed deleting user.')
			RequestError.handle(err, req, res)
		})
	}

#	public static buildUser(body: any): User {
#		const user = User.create()
#		user.email = body.email
#		user.firstName = body.firstName
#		user.lastName = body.lastName
#		return user
	}
}
