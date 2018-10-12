"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.validPassword = function (password) {
            return bcrypt.compareSync(password, this.password);
        };
    }
    register(password) {
        this.password = User_1.generateHash(password);
        return this.save();
    }
    authenticate(password) {
        return this.validPassword(password);
    }
    static findByEmail(email) {
        return User_1.findOne({ email: email });
    }
};
User.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity('users')
], User);
exports.default = User;
