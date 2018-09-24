/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-unused-expression */
/* tslint:disable:space-before-function-paren */

// External Dependencies
import 'mocha'
import { expect } from 'chai'
import { Agent, UnAuthorizedAgent, LoggedInUser } from '../config.test'

// Internal Deps
import User from '../../model/user'

// Factories
import { NewUser, CreateUser, RegisterUser } from '../factories/user'

describe('UserController', function () {
	this.timeout(10000)

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
			const testPassword = 'test-password'
			RegisterUser(testPassword).then((user: User) => {
				const userPayload = { email: user.email, password: testPassword }
				Agent.post('/register').send(userPayload).end(function (err: Error, res) {
					expect(err).to.exist
					expect(res).to.have.status(401)
					done()
				})
			})
		})

		it('should successfully return the created user payload', function (done) {
			const creds = NewUser()
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

		it('should return 401 for a bad password', function (done) {
			RegisterUser('some-password').then((user: User) => {
				const userPayload = { email: user.email, password: 'other-password' }
				Agent.post('/login').send(userPayload).end(function (err: Error, res) {
					expect(res).to.have.status(401)
					done()
				})
			})
		})

		it('should successfully authenticated a registered user', function (done) {
			const testPassword = 'test-password'
			RegisterUser(testPassword).then((user: User) => {
				const userPayload = { email: user.email, password: testPassword }
				Agent.post('/login').send(userPayload).end(function (err: Error, res) {
					expect(res).to.have.status(201)
					done(err)
				})
			})
		})
	})

	describe('GET /users', function () {
		it('should return 401 status for unauthorized user', function (done) {
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
			RegisterUser('some-password').then((user: User) => {
				Agent.get(`/users/${user.id}`).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					done(err)
				})
			})
		})
	})

	describe('PUT /users', function () {
		it('should return 401 status for unauthorized user', function (done) {
			UnAuthorizedAgent.put('/users/10').send({}).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it('should return 422 status for invalid payload', function (done) {
			RegisterUser('some-password').then((user: User) => {
				Agent.put(`/users/${user.id}`).send({}).end(function (err: Error, res) {
					expect(err).to.exist
					expect(res).to.have.status(422)
					done()
				})
			})
		})

		it('should return 404 status for not found user', function (done) {
			const payload = { firstName: 'New Name' }
			Agent.put(`/users/555`).send(payload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should return the user.', function (done) {
			const payload = { firstName: 'New Name' }
			Agent.put(`/users/${LoggedInUser.id}`).send(payload).end(function (err: Error, res) {
				expect(res).to.have.status(200)
				done(err)
			})
		})
	})

	describe('DELETE /users', function () {
		it('should return 401 status for unauthorized user', function (done) {
			UnAuthorizedAgent.del('/users/555').end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(401)
				done()
			})
		})

		it('should return 404 status for not found user', function (done) {
			Agent.del('/users/555').end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should successfully delete the user.', function (done) {
			RegisterUser('some-password').then((user: User) => {
				Agent.del(`/users/${user.id}`).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					done(err)
				})
			})
		})
	})
})
