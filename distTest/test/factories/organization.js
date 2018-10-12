"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory = require("factory.ts");
const Faker = require("faker");
const organization_1 = require("../../model/organization");
const organizationFactory = Factory.makeFactory({
    name: Factory.each((i) => Faker.name.firstName(4)),
});
const newOrganization = () => {
    return organizationFactory.build({});
};
exports.NewOrganization = newOrganization;
const createOrganization = () => {
    return organization_1.default.create(newOrganization()).save();
};
exports.CreateOrganization = createOrganization;
