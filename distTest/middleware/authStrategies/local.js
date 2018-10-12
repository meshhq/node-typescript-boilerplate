"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStrategy = require("passport-local");
const user_1 = require("../../controllers/user");
const logger_1 = require("../../utils/logger");
class LocalAuthStrategy {
    constructor() {
        this.Options = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        };
        this.authenticate = (req, email, password, done) => {
            try {
                user_1.default.authenticateUser(req, email, password, done);
            }
            catch (err) {
                logger_1.default.error(err);
            }
        };
    }
}
const strategy = new LocalAuthStrategy;
exports.default = new LocalStrategy.Strategy(strategy.Options, strategy.authenticate);
