/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-unused-expression */
/* tslint:disable:space-before-function-paren */

// External Dependencies
import 'mocha'
import { expect } from 'chai'
import { Agent, UnAuthorizedAgent } from '../config.test'

// Internal Deps
import User from '../../model/user'

// Factories
import { NewUser, CreateUser, RegisterUser } from '../factories/user'

/*
Questions
1. Query parameters v nested resources?
2. JSON Validation?
3. UserOrganization actions where?
*/
describe('UserController', function () {
	this.timeout(10000)
	const testPassword = 'test-password'

	let user: User

	beforeEach(function () {
		return User.destroy({ where: {} }).then(() => {
			return CreateUser()
		}).then((newUser: User) => {
			user = newUser
		})
	})

	// ------------------------------------------------------------------------
	// User Route Tests
	// ------------------------------------------------------------------------

	describe('POST /register', function () {
		it('should return 422 status for invalid payload', function (done) {
			const userPayload = { badParam: 'test' }
			Agent.post('/register').send(userPayload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(422)
				done()
			})
		})

		it('should return 401 status for existing email', function (done) {
			RegisterUser(testPassword).then((registeredUser: User) => {
				const userPayload = { email: user.email, password: testPassword }
				Agent.post('/register').send(userPayload).end(function (err: Error, res) {
					expect(err).to.exist
					expect(res).to.have.status(401)
					done()
				})
			})
		})

		it('should successfully return the created user payload', function (done) {
			const creds = { email: 'test@test.com', password: testPassword }
			Agent.post('/register').send(creds).end(function (err: Error, res) {
				expect(res).to.have.status(201)
				done(err)
			})
		})
	})

	describe('POST /login', function () {
		it('should return 400 status for invalid payload', function (done) {
			const badPayload = { badParam: 'test' }
			Agent.post('/login').send(badPayload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(400)
				done()
			})
		})

		it('should return 401 status for bad params', function (done) {
			const badPayload = { email: 'test@test.com', password: 'bad-password' }
			Agent.post('/login').send(badPayload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it('should return 401 for a bad password', function (done) {
			RegisterUser('some-password').then((registeredUser: User) => {
				const userPayload = { email: user.email, password: 'other-password' }
				Agent.post('/login').send(userPayload).end(function (err: Error, res) {
					expect(res).to.have.status(401)
					done()
				})
			})
		})

		it('should successfully authenticated a registered user', function (done) {
			RegisterUser(testPassword).then((registeredUser: User) => {
				const userPayload = { email: registeredUser.email, password: testPassword }
				Agent.post('/login').send(userPayload).end(function (err: Error, res) {
					expect(res).to.have.status(201)
					done(err)
				})
			})
		})
	})

	describe('GET /users', function () {
		it.skip('should return 401 status for unauthorized user', function (done) {
			UnAuthorizedAgent.get('/users').end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it('should return 404 status for not found user', function (done) {
			Agent.get(`/users/10`).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should return the correct user.', function (done) {
			Agent.get(`/users/${user.id}`).end(function (err: Error, res) {
				expect(res).to.have.status(200)
				done(err)
			})
		})
	})

	describe('PUT /users', function () {
		it.skip('should return 401 status for unauthorized user', function (done) {
			UnAuthorizedAgent.put('/users').send({}).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it('should return 422 status for invalid payload', function (done) {
			Agent.put(`/users/${user.id}`).send({}).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(422)
				done()
			})
		})

		it('should return 404 status for not found user', function (done) {
			const payload = { firstName: 'New Name' }
			Agent.put(`/users/10`).send(payload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should return the user.', function (done) {
			const payload = { firstName: 'New Name' }
			Agent.put(`/users/${user.id}`).send(payload).end(function (err: Error, res) {
				expect(res).to.have.status(200)
				done(err)
			})
		})
	})

	describe('DELETE /users', function () {
		it.skip('should return 401 status for unauthorized user', function (done) {
			UnAuthorizedAgent.del('/users').end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it.skip('should return 404 status for not found user', function (done) {
			Agent.del(`/users/10`).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should successfully delete the user.', function (done) {
			Agent.del(`/users/${user.id}`).end(function (err: Error, res) {
				expect(res).to.have.status(200)
				done(err)
			})
		})
	})
})
