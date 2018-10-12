"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class RequestError extends Error {
    static handle(err, req, res) {
        logger_1.default.error(err.message);
        if (err instanceof RequestError) {
            res.status(err.code).send(err.message);
        }
        else {
            res.status(500).send(err.message);
        }
    }
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.default = RequestError;
