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
exports.deleteFile = exports.generateFileName = exports.decodeToken = exports.getAuthorization = exports.deleteSession = exports.setSession = exports.clearRefreshToken = exports.setRefreshToken = exports.generateToken = exports.catchAsync = exports.HttpError = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promises_1 = require("fs/promises");
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = require("crypto");
(0, dotenv_1.config)({
    path: ".env",
});
var HttpErrorStatus;
(function (HttpErrorStatus) {
    HttpErrorStatus["ERROR_400"] = "400";
    HttpErrorStatus["ERROR_401"] = "401";
    HttpErrorStatus["ERROR_403"] = "403";
    HttpErrorStatus["ERROR_404"] = "404";
    HttpErrorStatus["ERROR_405"] = "405";
    HttpErrorStatus["ERROR_500"] = "500";
})(HttpErrorStatus || (HttpErrorStatus = {}));
const errorMessages = {
    "400": {
        title: "Bad request",
        message: "Incorrect data",
    },
    "401": {
        title: "Unauthorized",
        message: "Authentication required",
    },
    "403": {
        title: "Forbidden",
        message: "Cannot access this route",
    },
    "404": {
        title: "Not found",
        message: "There's no such route",
    },
    ["405"]: {
        title: "Method Not Allowed",
        message: "Method Not Allowed",
    },
    "500": {
        title: "Internal server error",
        message: "System is down",
    },
};
class HttpError extends Error {
    constructor(statucode, message = undefined) {
        super(errorMessages[`${statucode}`].message);
        this.statusCode = statucode;
        this.message = message || errorMessages[statucode].message;
        this.title = errorMessages[statucode].title;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
const catchAsync = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
const generateToken = (user) => {
    if (!process.env.ACCESS_TOKEN_SECRET)
        throw new HttpError(500);
    if (!process.env.REFRESH_TOKEN_SECRET)
        throw new HttpError(500);
    const access = jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
        _id: user._id.toString(),
    }, process.env.ACCESS_TOKEN_SECRET);
    const refresh = jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
        _id: user._id.toString(),
    }, process.env.REFRESH_TOKEN_SECRET);
    return { access, refresh };
};
exports.generateToken = generateToken;
const setRefreshToken = (res, refresh) => {
    res.cookie("jwt", refresh, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};
exports.setRefreshToken = setRefreshToken;
const clearRefreshToken = (res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
};
exports.clearRefreshToken = clearRefreshToken;
const setSession = (user, refresh) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.updateOne({ _id: { $eq: user._id } }, {
        session: refresh,
    });
});
exports.setSession = setSession;
const deleteSession = (session) => __awaiter(void 0, void 0, void 0, function* () {
    if (session)
        yield User_1.default.updateOne({ session: { $eq: session } }, {
            session: "",
        });
});
exports.deleteSession = deleteSession;
const getAuthorization = (req) => {
    const authorization = req.get("authorization");
    if (!authorization)
        throw new HttpError(401);
    if (authorization.split(" ").length !== 2)
        throw new HttpError(400);
    return authorization.split(" ")[1];
};
exports.getAuthorization = getAuthorization;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
exports.decodeToken = decodeToken;
const generateFileName = () => {
    const md5 = (0, crypto_1.createHash)("md5");
    md5.update(`${Date.now()}`);
    const buffer = md5.digest();
    return buffer.toString("hex");
};
exports.generateFileName = generateFileName;
const deleteFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, promises_1.unlink)(`${__dirname}/../../public/img/${filename}`);
});
exports.deleteFile = deleteFile;
