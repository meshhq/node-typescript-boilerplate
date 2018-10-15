/* tslint:disable:only-arrow-functions */
/* tslint:disable:no-unused-expression */
/* tslint:disable:space-before-function-paren */

// External Dependencies
import 'mocha'
import { expect } from 'chai'
import { Agent } from '../config.test'

// Internal Deps
import Organization from '../../model/organization'

import { NewOrganization, CreateOrganization } from '../factories/organization'

describe('OrganizationController', function () {
	this.timeout(10000)

	// ------------------------------------------------------------------------
	// Organization Route Tests
	// ------------------------------------------------------------------------

	describe('POST /organizations', function () {
		it('should return 422 status for invalid payload', function (done) {
			const orgPayload = { badParam: 'test' }
			Agent.post('/organizations').send(orgPayload).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(422)
				done()
			})
		})

		it('should return 401 status for existing name', function (done) {
			CreateOrganization().then((org: Organization) => {
				const orgPayload = { name: org.name }
				Agent.post('/organizations').send(orgPayload).end(function (err: Error, res) {
					expect(err).to.exist
					expect(res).to.have.status(401)
					done()
				})
			})
		})

		it('should successfully return the created organization payload', function (done) {
			const org = NewOrganization()
			Agent.post('/organizations').send(org).end(function (err: Error, res) {
				expect(res).to.have.status(201)
				done(err)
			})
		})
	})

	describe('GET /organizations', function () {
		it('should successfully return the organizations payload', function (done) {
			CreateOrganization().then((org: Organization) => {
				Agent.get('/organizations').send(org).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					expect(res.body.length).to.eq(3)
					done(err)
				})
			})
		})
	})

	describe('GET /organizations/:organization_id', function () {
		it('should return 404 status if organization not found', function (done) {
			Agent.get(`/organizations/1234567`).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should successfully return the organization payload corresponding to supplied id', function (done) {
			CreateOrganization().then((org: Organization) => {
				Agent.get(`/organizations/${org.id}`).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					done(err)
				})
			})
		})
	})

	describe('PUT /organizations/:organization_id', function () {
		it('should return 422 status for invalid payload', function (done) {
			CreateOrganization().then((organization: Organization) => {
				Agent.put(`/organizations/${organization.id}`).send({}).end(function (err: Error, res) {
					expect(err).to.exist
					expect(res).to.have.status(422)
					done()
				})
			})
		})

		it('should return organization', function (done) {
			CreateOrganization().then((organization: Organization) => {
				const newName = { name: 'newName' }
				Agent.put(`/organizations/${organization.id}`).send(newName).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					done(err)
				})
			})
		})
	})

	describe('DELETE /organizations', function () {
		it('should return 404 status if organization id cannot be found', function (done) {
			const invalidID = 999999999
			Agent.del(`/organizations/${invalidID}`).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should return 422 status if organization id cannot be found', function (done) {
			Agent.del(`/organizations`).end(function (err: Error, res) {
				expect(err).to.exist
				expect(res).to.have.status(404)
				done()
			})
		})

		it('should successfully delete organization with valid id and return a 200 status', function (done) {
			CreateOrganization().then((org: Organization) => {
				Agent.del(`/organizations/${org.id}`).end(function (err: Error, res) {
					expect(res).to.have.status(200)
					done()
				})
			})
		})
	})
})
