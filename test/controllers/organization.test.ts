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

describe.only('OrganizationController', function () {
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
})
