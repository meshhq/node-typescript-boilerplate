"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const config_test_1 = require("../config.test");
const organization_1 = require("../factories/organization");
describe.only('OrganizationController', function () {
    this.timeout(10000);
    describe('POST /organizations', function () {
        it('should return 422 status for invalid payload', function (done) {
            const orgPayload = { badParam: 'test' };
            config_test_1.Agent.post('/organizations').send(orgPayload).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(422);
                done();
            });
        });
        it('should return 401 status for existing name', function (done) {
            organization_1.CreateOrganization().then((org) => {
                const orgPayload = { name: org.name };
                config_test_1.Agent.post('/organizations').send(orgPayload).end(function (err, res) {
                    chai_1.expect(err).to.exist;
                    chai_1.expect(res).to.have.status(401);
                    done();
                });
            });
        });
        it('should successfully return the created organization payload', function (done) {
            const org = organization_1.NewOrganization();
            config_test_1.Agent.post('/organizations').send(org).end(function (err, res) {
                chai_1.expect(res).to.have.status(201);
                done(err);
            });
        });
    });
});
