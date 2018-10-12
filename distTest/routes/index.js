"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("./user");
const organization_1 = require("./organization");
class MeshRoutes {
    static mountRoutes(app) {
        const router = express_1.Router();
        user_1.default(router);
        organization_1.default(router);
        app.use('/', router);
    }
}
exports.default = MeshRoutes;
