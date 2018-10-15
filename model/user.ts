import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import * as bcrypt from 'bcrypt'
import PassportMiddleware from '../middleware/passport'

export interface UserInterface {
	firstName: string
	lastName: string
	email: string
	password: string
}

@Entity('users')
export default class User extends BaseEntity {

	public static findEmail(email: string): Promise<User | undefined> {
		return User.findOne({ email: email })
	}

	@PrimaryGeneratedColumn()
	public id: number

	@Column({ nullable: true })
	public firstName: string

	@Column({ nullable: true })
	public lastName: string
	@Column()
	public email: string

	@Column()
	public password: string

	public register(password: string): Promise<User> {
		this.password = User.generateHash(password)
		return this.save()
	}

	public authenticate(password: string): boolean {
		return this.validPassword(password)
	}

	public static findByEmail(email: string): Promise<User | undefined> {
		return User.findOne({ email: email })
	}

	// ---------------------------
	// Generates a password hash.
	// ---------------------------

	public static generateHash = (password: string): string => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}

	// -----------------------------------------------
	// Validates a supplied password against our hash
	// -----------------------------------------------

	public validPassword = function(password: string): boolean {
		return bcrypt.compareSync(password, this.password)
	}
}
