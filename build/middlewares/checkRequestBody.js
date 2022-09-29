"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const checkRequestBody = (fields) => {
    return (req, _res, next) => {
        const mapped = fields.map((f) => Object.keys(req.body).includes(f));
        if (mapped.includes(false))
            throw new utils_1.HttpError(400);
        next();
    };
};
exports.default = checkRequestBody;
