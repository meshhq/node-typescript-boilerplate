"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport = require("passport");
const user_1 = require("../model/user");
const local_1 = require("./authStrategies/local");
class PassportMiddleware {
    static MountStrategies() {
        Passport.use('local', local_1.default);
    }
    static SetupUserSerializations() {
        Passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        Passport.deserializeUser((id, done) => {
            user_1.default.findOneById(id).then((user) => {
                return done(null, user);
            });
        });
    }
    static ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.sendStatus(401);
    }
    static initialize() {
        let handler = Passport.initialize();
        return handler;
    }
    static session() {
        return Passport.session();
    }
    static use(strategy) {
        return Passport.use(strategy);
    }
    static useWithStrategy(name, strategy) {
        return Passport.use(name, strategy);
    }
}
exports.default = PassportMiddleware;
