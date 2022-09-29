"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const restricted = (req, _res, next) => {
    const authorization = req.get("authorization");
    if (!authorization)
        throw new utils_1.HttpError(401, "Authentication required");
    const token = authorization.split(" ")[1];
    if (!process.env.ACCESS_TOKEN_SECRET)
        throw new utils_1.HttpError(500);
    if (!jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET))
        throw new utils_1.HttpError(401, "Authentication token has expired");
    const { _id: id } = (0, utils_1.decodeToken)(token);
    req.id = id;
    next();
};
exports.default = restricted;
