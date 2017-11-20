import * as Factory from 'factory.ts'
import * as Faker from 'faker'
import User, { UserInterface } from '../../model/user'

const userFactory = Factory.makeFactory<UserInterface>({
	firstName: Factory.each((i) => Faker.lorem.words(4)),
	lastName: Factory.each((i) => Faker.lorem.words(4)),
	email: Factory.each((i) => Faker.lorem.words(4)),
	password: Factory.each((i) => Faker.lorem.words(10))
})

let newUser = () => {
	return userFactory.build({})
}

let createUser = () => {
	return User.create(newUser())
}

let registerUser = (password: String) => {
	let user = newUser()
	user.password = password
	return User.register(user)
}

export { newUser as NewUser }
export { createUser as CreateUser }
export { registerUser as RegisterUser }
