"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const Faker = require("faker");
const chai = require("chai");
const chaihttp = require('chai-http');
require("mocha");
const server_1 = require("../server");
const expect = chai.expect;
const app = server_1.default.bootstrap();
const redis_1 = require("../services/redis");
const user_1 = require("./factories/user");
chai.use(chaihttp);
dotenv.config({ silent: true });
exports.Agent = chai.request.agent(app);
exports.UnAuthorizedAgent = chai.request.agent(app);
const userPass = Faker.internet.password();
const typeorm_1 = require("typeorm");
before(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield typeorm_1.createConnection();
        yield connection.synchronize(true);
        yield redis_1.default.flushRedis();
        exports.LoggedInUser = yield user_1.RegisterUser(userPass);
        const creds = { email: exports.LoggedInUser.email, password: userPass };
        yield exports.Agent.post('/login').send(creds);
    });
});
