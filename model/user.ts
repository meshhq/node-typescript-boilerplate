import {
	InitOptions,
	DataTypes,
	ModelAttributes,
	Model,
	UpdateOptions,
	FindOptions,
	Promise as Bluebird
} from 'sequelize'

import * as bcrypt from 'bcrypt'

// Interfaces
import DB from '../utils/db'

// Logger
import Logger from '../utils/logger'

/**
 * Model Declaration
 */
export interface UserInterface {
	email: string
	password: string
	firstName?: string
	lastName?: string
}

/**
 * Model Declaration
 */
export default class User extends Model {

	public static register (userData: UserInterface): Bluebird<User> {
		userData.password = User.generateHash(userData.password)
		return User.create(userData)
	}

	public static findByEmail (email: string): Bluebird<User | null> {
		const options: FindOptions = { where: { email: email } }
		return User.findOne(options)
	}

	public static updateById (id: number, values: object): Bluebird<{}> {
		const options: UpdateOptions = { where: { id: id }, returning: true }
		return User.update(values, options).spread((userNumber: number, users: User[]) => {
			if (userNumber === 0) {
				return null
			}
			return users[0]
		})
	}

	// ---------------------------
	// Generates a password hash.
	// ---------------------------

	public static generateHash (password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}

	public id: number
	public email: string
	public password: string
	public firstName: string
	public lastName: string

	public authenticate (password: string): boolean {
		return this.validPassword(password)
	}

	// -----------------------------------------------
	// Validates a supplied password against our hash
	// -----------------------------------------------

	public validPassword (password: string): boolean {
		return bcrypt.compareSync(password, this.password);
	}
}

/**
 * Model Schema
 */
const userSchema: ModelAttributes = {
	id: {
		autoIncrement: true,
		field: 'id',
		primaryKey: true,
		type: DataTypes.INTEGER
	},
	email: {
		field: 'email',
		type: DataTypes.STRING
	},
	password: {
		field: 'password',
		type: DataTypes.STRING
	},
	firstName: {
		field: 'firstName',
		type: DataTypes.STRING
	},
	lastName: {
		field: 'lastName',
		type: DataTypes.STRING
	},
}

/**
 * Model Init Options
 */
const opts: InitOptions = {
	sequelize: DB.SharedInstance,
	timestamps: true  // Will add a createdAt/updatedAt timestamp
}

User.init(userSchema, opts)
