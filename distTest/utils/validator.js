"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    constructor(bodyParams) {
        this.bodyParams = bodyParams;
    }
    ValidateRequest(req) {
        switch (req.method) {
            case 'POST':
                return this.validateBody(req);
            case 'GET':
                return true;
            case 'PUT':
                return this.validateBody(req);
            case 'DELETE':
                return true;
        }
        return false;
    }
    validateBody(req) {
        if (Object.keys(req.body).length === 0) {
            return false;
        }
        for (const key of Object.keys(req.body)) {
            if (this.bodyParams.indexOf(key) === -1) {
                return false;
            }
        }
        return true;
    }
}
exports.default = Validator;
