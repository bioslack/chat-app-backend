"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameGroupValidator = exports.addUsersToGroupValidator = exports.createGroupValidator = exports.signupValidator = exports.signinValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
const signinSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8),
});
const signupSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8),
    confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref("password")),
});
const idPattern = /[a-f0-9]{24}/;
const createGroupSchema = joi_1.default.object({
    name: joi_1.default.string().min(5).required(),
    picture: joi_1.default.string().empty(),
    admins: joi_1.default.array()
        .min(1)
        .items(joi_1.default.string().regex(RegExp(idPattern)).length(24)),
    members: joi_1.default.array()
        .min(1)
        .items(joi_1.default.string().regex(RegExp(idPattern)).length(24)),
});
const addUserToGroupSchema = joi_1.default.object({
    groupId: joi_1.default.string().regex(RegExp(idPattern)).length(24),
    userIds: joi_1.default.array()
        .min(1)
        .items(joi_1.default.string().regex(RegExp(idPattern)).length(24)),
});
const renameGroupSchema = joi_1.default.object({
    groupId: joi_1.default.string().regex(RegExp(idPattern)).length(24),
    name: joi_1.default.string().min(5),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validator = (schema) => {
    return (req, _res, next) => {
        if (Object.keys(schema.validate(req.body)).includes("error"))
            throw new utils_1.HttpError(400, "Validation error");
        next();
    };
};
const signinValidator = () => {
    return validator(signinSchema);
};
exports.signinValidator = signinValidator;
const signupValidator = () => {
    return validator(signupSchema);
};
exports.signupValidator = signupValidator;
const createGroupValidator = () => {
    return validator(createGroupSchema);
};
exports.createGroupValidator = createGroupValidator;
const addUsersToGroupValidator = () => {
    return validator(addUserToGroupSchema);
};
exports.addUsersToGroupValidator = addUsersToGroupValidator;
const renameGroupValidator = () => {
    return validator(renameGroupSchema);
};
exports.renameGroupValidator = renameGroupValidator;
