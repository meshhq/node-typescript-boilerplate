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
import User from '../model/user'
import Redis from '../services/redis'

// Factories
import { NewUser, RegisterUser } from './factories/user'

// Enable Chai HTTP
chai.use(chaihttp)

// Set ENVs
dotenv.config({ silent: true })

export const Agent = chai.request.agent(app)
export const UnAuthorizedAgent = chai.request.agent(app)

const userPass = Faker.internet.password()
export let LoggedInUser: User

import { createConnection, Connection, UseContainerOptions } from "typeorm";

before(async function () {
	await createConnection()
	await Redis.flushRedis()

	// Create a user and authenticate.
	LoggedInUser = await RegisterUser(userPass)
	const creds = { email: LoggedInUser.email, password: userPass }
	await Agent.post('/login').send(creds).end(function (err: Error, res) {
		expect(res).to.have.status(201)
	})
})
