/* tslint:disable:only-arrow-functions */

// External Dependencies
import * as dotenv from 'dotenv'
import * as Faker from 'faker'
import * as chai from 'chai'
const chaihttp = require('chai-http')
import 'mocha'

// Internal Deps
import server from '../server'
const expect = chai.expect
const app = server.bootstrap()
import DB from '../utils/db'
import User from '../model/user'

// Enable Chai HTTP
chai.use(chaihttp)

// Set ENVs
dotenv.config({ silent: true })

const userPass = Faker.internet.password()
const userEmail = Faker.internet.email()

export const Agent = chai.request.agent(app)
export const UnAuthorizedAgent = chai.request.agent(app)
export let LoggedInUser: User

before(function () {
	const dbClient = DB.SharedInstance
	return dbClient.sync().then(function () {
		return User.create({
			firstName: 'test',
			githubAccessToken: process.env.GITHUB_USER_AUTH_TOKEN,
			githubHandle: 'test',
			lastName: 'test',
		})
	})
})
