import * as Factory from 'factory.ts'
import * as Faker from 'faker'
import User, { UserInterface } from '../../model/user'

const userFactory = Factory.makeFactory<UserInterface>({
	email: Factory.each((i) => Faker.internet.email()),
	firstName: Factory.each((i) => Faker.name.firstName(4)),
	lastName: Factory.each((i) => Faker.name.firstName(4)),
	password: Factory.each((i) => Faker.internet.password(10))
})

const newUser = () => {
	return userFactory.build({})
}

const createUser = () => {
	return User.create(newUser())
}

const registerUser = (password: string) => {
	const user = User.create(newUser())
	return user.register(password)
}

export { newUser as NewUser }
export { createUser as CreateUser }
export { registerUser as RegisterUser }
