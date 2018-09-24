
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import * as bcrypt from 'bcrypt'
import PassportMiddleware from '../middleware/passport'

export interface OrganizationInterface {
	name: string
}

@Entity('organizations')
export default class Organization extends BaseEntity {

	public static findByName(name: string): Promise<Organization | undefined> {
		return Organization.findOne({ name: name })
	}

	@PrimaryGeneratedColumn()
	public id: number

	@Column({ nullable: true })
	public name: string
}
