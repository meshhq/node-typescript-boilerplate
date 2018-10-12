"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const user_1 = require("../controllers/user");
const passport_1 = require("../middleware/passport");
function createUserRoutes(router) {
    router.post('/register', user_1.default.registerUser, passport.authenticate('local'), function (req, res) {
        res.status(201).send();
    });
    router.post('/login', passport.authenticate('local'), function (req, res) {
        res.status(201).send();
    });
    router.get('/users', passport_1.default.ensureAuthenticated, user_1.default.getUsers);
    router.get('/users/:user_id', passport_1.default.ensureAuthenticated, user_1.default.getUser);
    router.put('/users/:user_id', passport_1.default.ensureAuthenticated, user_1.default.updateUser);
    router.delete('/users/:user_id', passport_1.default.ensureAuthenticated, user_1.default.deleteUser);
}
exports.default = createUserRoutes;
