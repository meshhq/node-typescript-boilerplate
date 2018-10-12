"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const config_test_1 = require("../config.test");
const user_1 = require("../factories/user");
describe('UserController', function () {
    this.timeout(10000);
    describe('POST /register', function () {
        it('should return 422 status for invalid payload', function (done) {
            const userPayload = { badParam: 'test' };
            config_test_1.Agent.post('/register').send(userPayload).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(422);
                done();
            });
        });
        it('should return 401 status for existing email', function (done) {
            const testPassword = 'test-password';
            user_1.RegisterUser(testPassword).then((user) => {
                const userPayload = { email: user.email, password: testPassword };
                config_test_1.Agent.post('/register').send(userPayload).end(function (err, res) {
                    chai_1.expect(err).to.exist;
                    chai_1.expect(res).to.have.status(401);
                    done();
                });
            });
        });
        it('should successfully return the created user payload', function (done) {
            const creds = user_1.NewUser();
            config_test_1.Agent.post('/register').send(creds).end(function (err, res) {
                chai_1.expect(res).to.have.status(201);
                done(err);
            });
        });
    });
    describe('POST /login', function () {
        it('should return 400 status for invalid payload', function (done) {
            const badPayload = { badParam: 'test' };
            config_test_1.Agent.post('/login').send(badPayload).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(400);
                done();
            });
        });
        it('should return 401 for a bad password', function (done) {
            user_1.RegisterUser('some-password').then((user) => {
                const userPayload = { email: user.email, password: 'other-password' };
                config_test_1.Agent.post('/login').send(userPayload).end(function (err, res) {
                    chai_1.expect(res).to.have.status(401);
                    done();
                });
            });
        });
        it('should successfully authenticated a registered user', function (done) {
            const testPassword = 'test-password';
            user_1.RegisterUser(testPassword).then((user) => {
                const userPayload = { email: user.email, password: testPassword };
                config_test_1.Agent.post('/login').send(userPayload).end(function (err, res) {
                    chai_1.expect(res).to.have.status(201);
                    done(err);
                });
            });
        });
    });
    describe('GET /users', function () {
        it('should return 401 status for unauthorized user', function (done) {
            config_test_1.UnAuthorizedAgent.get('/users').end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(401);
                done();
            });
        });
        it('should return 404 status for not found user', function (done) {
            config_test_1.Agent.get(`/users/10`).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(404);
                done();
            });
        });
        it('should return the correct user.', function (done) {
            user_1.RegisterUser('some-password').then((user) => {
                config_test_1.Agent.get(`/users/${user.id}`).end(function (err, res) {
                    chai_1.expect(res).to.have.status(200);
                    done(err);
                });
            });
        });
    });
    describe('PUT /users', function () {
        it('should return 401 status for unauthorized user', function (done) {
            config_test_1.UnAuthorizedAgent.put('/users/10').send({}).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(401);
                done();
            });
        });
        it('should return 422 status for invalid payload', function (done) {
            user_1.RegisterUser('some-password').then((user) => {
                config_test_1.Agent.put(`/users/${user.id}`).send({}).end(function (err, res) {
                    chai_1.expect(err).to.exist;
                    chai_1.expect(res).to.have.status(422);
                    done();
                });
            });
        });
        it('should return 404 status for not found user', function (done) {
            const payload = { firstName: 'New Name' };
            config_test_1.Agent.put(`/users/555`).send(payload).end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(404);
                done();
            });
        });
        it('should return the user.', function (done) {
            const payload = { firstName: 'New Name' };
            config_test_1.Agent.put(`/users/${config_test_1.LoggedInUser.id}`).send(payload).end(function (err, res) {
                chai_1.expect(res).to.have.status(200);
                done(err);
            });
        });
    });
    describe('DELETE /users', function () {
        it('should return 401 status for unauthorized user', function (done) {
            config_test_1.UnAuthorizedAgent.del('/users/555').end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(401);
                done();
            });
        });
        it('should return 404 status for not found user', function (done) {
            config_test_1.Agent.del('/users/555').end(function (err, res) {
                chai_1.expect(err).to.exist;
                chai_1.expect(res).to.have.status(404);
                done();
            });
        });
        it('should successfully delete the user.', function (done) {
            user_1.RegisterUser('some-password').then((user) => {
                config_test_1.Agent.del(`/users/${user.id}`).end(function (err, res) {
                    chai_1.expect(res).to.have.status(200);
                    done(err);
                });
            });
        });
    });
});
