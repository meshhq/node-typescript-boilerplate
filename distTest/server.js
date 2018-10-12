"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app_1 = require("./middleware/app");
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
require("reflect-metadata");
logger_1.default.info(`Node Process Started`);
process.on('exit', (code) => {
    logger_1.default.info(`About to exit process with code: ${code}`);
});
class Server {
    static bootstrap() {
        return new Server().app;
    }
    constructor() {
        this.app = express();
        app_1.default.configureApplication(this.app);
        routes_1.default.mountRoutes(this.app);
    }
}
exports.default = Server;
