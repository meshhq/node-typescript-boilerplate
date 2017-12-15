import * as Factory from 'factory.ts'
import * as Faker from 'faker'
import User, { UserInterface } from '../../model/user'

const userFactory = Factory.makeFactory<UserInterface>({
	firstName: Factory.each((i) => Faker.name.firstName()),
	lastName: Factory.each((i) => Faker.name.lastName()),
	email: Factory.each((i) => Faker.internet.email()),
	password: Factory.each((i) => Faker.internet.password(10))
})

const newUser = () => {
	return userFactory.build({})
}

const createUser = () => {
	return User.create(newUser())
}

const registerUser = (password: string) => {
	const user = newUser()
	user.password = password
	return User.register(user)
}

export { newUser as NewUser }
export { createUser as CreateUser }
export { registerUser as RegisterUser }
