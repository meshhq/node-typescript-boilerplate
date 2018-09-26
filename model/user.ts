
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import * as bcrypt from 'bcrypt'
import PassportMiddleware from '../middleware/passport'

export interface UserInterface {
	firstName: String
	lastName: String
	email: String
	password: String
}

@Entity('users')
export default class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	public id: number

	@Column({ nullable: true })
	public firstName: String

	@Column({ nullable: true })
	public lastName: String

	@Column()
	public email: String

	@Column()
	public password: String

	public register(password: String): Promise<User> {
		this.password = User.generateHash(password)
		return this.save()
	}

	public authenticate(password: String): Boolean {
		return this.validPassword(password)
	}

	public static findByEmail(email: string): Promise<User | undefined> {
		return User.findOne({ email: email })
	}

	// ---------------------------
	// Generates a password hash.
	// ---------------------------

	public static generateHash = function(password: String): String {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}

	// -----------------------------------------------
	// Validates a supplied password against our hash
	// -----------------------------------------------

	public validPassword = function(password: String): Boolean {
		return bcrypt.compareSync(password, this.password)
	}
}
