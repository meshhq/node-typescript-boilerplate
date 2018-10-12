"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
function default_1(req, res, next) {
    const baseURLWhitelist = [
        'http://localhost:8080',
        'http://localhost:3000',
    ];
    const headerWhitelist = [
        'Access-Control-Allow-Origin',
        'Accept-Encoding',
        'Accept-Language',
        'Authorization',
        'Content-Length',
        'Cookie',
        'Content-Type',
        'Content-Length',
        'MeshAuth',
        'Set-Cookie',
        'X-Redirect',
        'X-Web-Source'
    ];
    const corsOptions = {
        allowedHeaders: headerWhitelist,
        credentials: true,
        exposedHeaders: headerWhitelist,
        origin: (origin, callback) => {
            callback(null, true);
        }
    };
    cors(corsOptions)(req, res, next);
}
exports.default = default_1;
