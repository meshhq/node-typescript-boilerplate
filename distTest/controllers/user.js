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
const user_1 = require("../model/user");
const logger_1 = require("../utils/logger");
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const bodyParams = ['email', 'password', 'firstName', 'lastName'];
const validator = new validator_1.default(bodyParams);
class UserController {
    static getUser(req, res) {
        const valid = validator.ValidateRequest(req);
        if (!valid) {
            const err = new error_1.default(422, `Failed to find user. Req parameters are invalid: ${req}`);
            return error_1.default.handle(err, req, res);
        }
        logger_1.default.info(`Fetching user with id: ${req.params.user_id}`);
        user_1.default.findOneById(req.params.user_id).then((user) => {
            if (!user) {
                throw new error_1.default(404, `Failed to find user with id: ${req.params.user_id}`);
            }
            logger_1.default.info(`Found user: ${user}`);
            res.status(200).json(user);
        }).catch((err) => {
            error_1.default.handle(err, req, res);
        });
    }
    static getUsers(req, res) {
        const valid = validator.ValidateRequest(req);
        if (!valid) {
            const err = new error_1.default(422, `Failed to find users. Req parameters are invalid: ${req}`);
            return error_1.default.handle(err, req, res);
        }
        logger_1.default.info('Find all Users for User: ', req.user.githubHandle);
        user_1.default.find({ where: req.query }).then((users) => {
            if (users.length === 0) {
                throw new error_1.default(404, `Failed to find users for query: ${req.query}`);
            }
            logger_1.default.info(`Found users: ${users} for query: ${req.query} `);
            res.status(200).json(users);
        }).catch((err) => {
            error_1.default.handle(err, req, res);
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = req.params.user_id && validator.ValidateRequest(req);
            if (!valid) {
                const err = new error_1.default(422, `Failed to update user. Req parameters are invalid: ${req}`);
                return error_1.default.handle(err, req, res);
            }
            logger_1.default.info(`Fetching user with id: ${req.params.user_id}`);
            user_1.default.findOneById(req.params.user_id).then((user) => {
                if (!user) {
                    throw new error_1.default(404, `Failed to find user with id: ${req.params.user_id}`);
                }
                logger_1.default.info(`Updating user with ID ${req.params.user_id}`);
                user_1.default.updateById(req.params.user_id, req.body);
            }).then(() => {
                logger_1.default.info(`Updated User with ID ${req.params.user_id}`);
                res.status(200).json();
            }).catch((err) => {
                logger_1.default.error('Failed updating user.');
                error_1.default.handle(err, req, res);
            });
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = req.params.user_id;
            if (!valid) {
                const err = new error_1.default(422, `Failed to delete user. Req parameters are invalid: ${req}`);
                return error_1.default.handle(err, req, res);
            }
            logger_1.default.info(`Fetching user with id: ${req.params.user_id}`);
            user_1.default.findOneById(req.params.user_id).then((user) => {
                if (!user) {
                    throw new error_1.default(404, `Failed to find user with id: ${req.params.user_id}`);
                }
                logger_1.default.info(`Deleting user with ID ${req.params.user_id} `);
                user_1.default.removeById(req.params.user_id);
            }).then(() => {
                logger_1.default.info(`Deleted user with ID: ${req.params.user_id} `);
                res.status(200).json();
            }).catch((err) => {
                logger_1.default.error('Failed deleting user.');
                error_1.default.handle(err, req, res);
            });
        });
    }
    static buildUser(body) {
        const user = user_1.default.create();
        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        return user;
    }
}
UserController.authenticateUser = (req, email, password, done) => {
    logger_1.default.info(`Checking for existing user with email: ${email}`);
    user_1.default.findByEmail(email).then((user) => {
        if (!user) {
            logger_1.default.info(`Failed to find user with email: ${email}`);
            return done();
        }
        logger_1.default.info(`Validating password for email: ${req.body.email}`);
        const valid = user.authenticate(password);
        if (!valid) {
            logger_1.default.info(`Failed to authenticate user with email: ${email}`);
            return done();
        }
        done(null, user);
    }).catch((err) => {
        logger_1.default.error('Error in authenticateUser() - ', err);
        const plainError = new Error('Internal server error');
        done(plainError);
    });
};
UserController.registerUser = (req, res, next) => {
    const valid = req.body.email && req.body.password;
    if (!valid) {
        const err = new error_1.default(422, `Failed to register user. Req parameters are invalid.`);
        return error_1.default.handle(err, req, res);
    }
    logger_1.default.info(`Checking for existing user with email: ${req.body.email}`);
    user_1.default.findByEmail(req.body.email).then((user) => {
        if (user) {
            throw new error_1.default(401, `Conflict. User with email: ${req.params.user_id} already exists.`);
        }
        logger_1.default.info(`Creating new user with email: ${req.body.email}`);
        const newUser = UserController.buildUser(req.body);
        return newUser.register(req.body.password);
    }).then((newUser) => {
        next();
    }).catch((err) => {
        error_1.default.handle(err, req, res);
    });
};
exports.default = UserController;
