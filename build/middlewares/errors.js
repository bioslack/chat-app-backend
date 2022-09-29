"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.error = void 0;
const utils_1 = require("../utils");
const error = (err, _req, res, _next) => {
    let error = Object.assign(Object.assign({}, err), { message: err.message });
    // console.log(error);
    if (error.code && error.code === 11000)
        error = new utils_1.HttpError(400, "Duplicate user");
    if (error.name && error.name === "ValidationError")
        error = new utils_1.HttpError(400, "Invalid data");
    if (error.name && error.name === "JsonWebTokenError")
        error = new utils_1.HttpError(401, "Invalid token");
    return res.status(error.statusCode).json({
        message: error.message,
        statusCode: error.statusCode,
    });
};
exports.error = error;
const notFound = (_req, _res, _next) => {
    throw new utils_1.HttpError(404);
};
exports.notFound = notFound;
