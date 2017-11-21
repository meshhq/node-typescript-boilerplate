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
	email: String
	password: String
	firstName?: string
	lastName?: string
}

/**
 * Model Declaration
 */
export default class User extends Model {
	public id: number
	public email: String
	public password: String
	public firstName: string
	public lastName: string

	public static register(userData: UserInterface): Bluebird<User> {
		userData.password = User.generateHash(userData.password)
		return User.create(userData)
	}

	public authenticate(password: String): Boolean {
		return this.validPassword(password)
	}

	public static findByEmail(email: string): Bluebird<User | null> {
		const options: FindOptions = { where: { 'email': email } }
		return User.findOne(options)
	}

	public static updateById(id: number, values: Object): Bluebird<{}> {
		const options: UpdateOptions = { where: { 'id': id }, returning: true }
		return User.update(values, options).spread((number: number, users: User[]) => {
			if (number === 0) {
				return null
			}
			return users[0]
		})
	}

	//---------------------------
	// Generates a password hash.
	//---------------------------

	public static generateHash = function (password: String): String {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	};

	//-----------------------------------------------
	// Validates a supplied password against our hash
	//-----------------------------------------------

	public validPassword = function (password: String): Boolean {
		return bcrypt.compareSync(password, this.password);
	};
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