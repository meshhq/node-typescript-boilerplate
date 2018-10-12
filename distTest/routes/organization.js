"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const organization_1 = require("../controllers/organization");
function createOrganizationRoutes(router) {
    router.post('/organizations', organization_1.default.createOrganization);
    router.delete('/organizations/:organization_id', organization_1.default.deleteOrganization);
}
exports.default = createOrganizationRoutes;
