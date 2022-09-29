"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.logout = exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const User_1 = __importDefault(require("../models/User"));
const utils_1 = require("../utils");
(0, dotenv_1.config)({
    path: ".env",
});
exports.signup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield User_1.default.create(req.body);
    const { access, refresh } = (0, utils_1.generateToken)(newUser);
    yield (0, utils_1.setSession)(newUser, refresh);
    (0, utils_1.setRefreshToken)(res, refresh);
    res.status(200).send({ access });
}));
exports.signin = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    const found = yield User_1.default.findOne({ email });
    if (!found)
        throw new utils_1.HttpError(400);
    if (!(yield bcrypt_1.default.compare(password, found.password)))
        throw new utils_1.HttpError(401, "Wrong credentials");
    const { access, refresh } = (0, utils_1.generateToken)(found);
    yield (0, utils_1.setSession)(found, refresh);
    (0, utils_1.setRefreshToken)(res, refresh);
    res.status(200).send({ access });
}));
exports.logout = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, utils_1.deleteSession)((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt);
    (0, utils_1.clearRefreshToken)(res);
    res.status(204).send();
}));
exports.refresh = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        throw new utils_1.HttpError(401, "Invalid token");
    const found = yield User_1.default.findOne({ session: cookies.jwt });
    if (!found)
        throw new utils_1.HttpError(401, "User not found");
    const oldRefresh = cookies.jwt;
    if (!process.env.REFRESH_TOKEN_SECRET)
        throw new utils_1.HttpError(500);
    if (!jsonwebtoken_1.default.verify(oldRefresh, process.env.REFRESH_TOKEN_SECRET))
        throw new utils_1.HttpError(401, "Invalid token");
    (0, utils_1.clearRefreshToken)(res);
    const { access, refresh } = (0, utils_1.generateToken)(found);
    (0, utils_1.setSession)(found, refresh);
    (0, utils_1.setRefreshToken)(res, refresh);
    res.status(200).send({ access });
}));
