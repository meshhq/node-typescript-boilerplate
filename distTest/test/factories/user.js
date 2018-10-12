"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory = require("factory.ts");
const Faker = require("faker");
const user_1 = require("../../model/user");
const userFactory = Factory.makeFactory({
    email: Factory.each((i) => Faker.internet.email()),
    firstName: Factory.each((i) => Faker.name.firstName(4)),
    lastName: Factory.each((i) => Faker.name.firstName(4)),
    password: Factory.each((i) => Faker.internet.password(10))
});
const newUser = () => {
    return userFactory.build({});
};
exports.NewUser = newUser;
const createUser = () => {
    return user_1.default.create(newUser());
};
exports.CreateUser = createUser;
const registerUser = (password) => {
    const user = user_1.default.create(newUser());
    return user.register(password);
};
exports.RegisterUser = registerUser;
