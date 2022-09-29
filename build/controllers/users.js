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
exports.getGroups = exports.getUser = exports.getUsers = void 0;
const Group_1 = __importDefault(require("../models/Group"));
const User_1 = __importDefault(require("../models/User"));
const utils_1 = require("../utils");
exports.getUsers = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({
        _id: { $ne: req.id },
        name: { $regex: req.query.name, $options: "i" },
    });
    // const users = await User.find();
    res.status(200).send({
        users: users.map((u) => {
            u.session = "";
            u.password = "";
            return u;
        }),
    });
}));
exports.getUser = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ _id: req.id });
    res.status(200).send({ user });
}));
exports.getGroups = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield Group_1.default.find({ members: req.id });
    res.status(200).send({ groups });
}));
