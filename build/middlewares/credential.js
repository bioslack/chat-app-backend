"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8888",
    "http://192.168.3.21:3000",
];
const credentials = (req, res, next) => {
    const origin = req.headers.origin || "";
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};
exports.default = credentials;
