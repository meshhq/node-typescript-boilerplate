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
const organization_1 = require("../model/organization");
const logger_1 = require("../utils/logger");
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const bodyParams = ['name', 'firstName', 'lastName'];
const validator = new validator_1.default(bodyParams);
class OrganizationController {
    static deleteOrganization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = req.params.organization_id;
            if (!valid) {
                const err = new error_1.default(422, `Failed to delete organizations. Req parameters are invalid: ${req}`);
                return error_1.default.handle(err, req, res);
            }
            logger_1.default.info(`Fetching organization with id: ${req.params.organization_id}`);
            organization_1.default.findOneById(req.params.organization_id).then((organization) => {
                if (!organization) {
                    throw new error_1.default(404, `Failed to find organization with id: ${req.params.organization_id}`);
                }
                logger_1.default.info(`Deleting organization with ID ${req.params.organization_id} `);
                organization_1.default.removeById(req.params.organization_id);
            }).then(() => {
                logger_1.default.info(`Deleted organization with ID: ${req.params.organization_id} `);
                res.status(200).json();
            }).catch((err) => {
                logger_1.default.error('Failed deleting organization.');
                error_1.default.handle(err, req, res);
            });
        });
    }
    static buildOrganization(body) {
        const organization = organization_1.default.create();
        organization.name = body.name;
        return organization;
    }
}
OrganizationController.createOrganization = (req, res) => {
    const name = req.body.name;
    if (!name) {
        const err = new error_1.default(422, `Failed to create organization. Req parameters are invalid.`);
        return error_1.default.handle(err, req, res);
    }
    logger_1.default.info(`Checking for existing organization with name: ${name}`);
    organization_1.default.findByName(name).then((organization) => {
        if (organization) {
            throw new error_1.default(401, `Conflict. Organization with name: ${name} already exists.`);
        }
        logger_1.default.info(`Creating new organization with name: ${req.body.name}`);
        const newOrganization = OrganizationController.buildOrganization(req.body);
        return newOrganization.save();
    }).then((organization) => {
        logger_1.default.info(`Save Organization with Name ${name}`);
        res.status(201).json(organization);
    }).catch((err) => {
        error_1.default.handle(err, req, res);
    });
};
exports.default = OrganizationController;
