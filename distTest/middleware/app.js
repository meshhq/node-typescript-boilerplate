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
const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const RedisStore = require("connect-redis");
const DotENV = require("dotenv");
const compression = require("compression");
const errorHandler = require("errorhandler");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const passport_1 = require("./passport");
const cors_1 = require("./cors");
const redis_1 = require("../services/redis");
exports.SESSION_SECRET = 'MeshSecret';
exports.SESSION_PREFIX = 'MeshSession';
class MeshConfig {
    static configureApplication(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV !== "test") {
                typeorm_1.createConnection().then((connection) => {
                    connection.synchronize();
                });
            }
            DotENV.config();
            app.use(compression());
            app.use(express.static(path.join(__dirname, 'public')));
            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'pug');
            app.use(logger('dev'));
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());
            app.use((err, req, res, next) => {
                res.status(404).send('You found a dead link! Sorry can\'t find that!');
            });
            const redisSessionStore = RedisStore(session);
            const sessiontOpts = {
                resave: false,
                saveUninitialized: true,
                secret: exports.SESSION_SECRET,
                store: new redisSessionStore({
                    client: redis_1.default.RedisClient(),
                    prefix: exports.SESSION_PREFIX
                })
            };
            app.use(session(sessiontOpts));
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            passport_1.default.MountStrategies();
            passport_1.default.SetupUserSerializations();
            app.use(cors_1.default);
            app.use(errorHandler());
        });
    }
}
exports.default = MeshConfig;
