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
exports.deleteGroup = exports.renameGroup = exports.addUsersToGroup = exports.createGroup = void 0;
const Group_1 = __importDefault(require("../models/Group"));
const utils_1 = require("../utils");
exports.createGroup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield Group_1.default.create(req.body);
    res.status(200).send({ _id: group._id.toString() });
}));
exports.addUsersToGroup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userIds, groupId } = req.body;
    const group = yield Group_1.default.findOne({ _id: groupId });
    if (!group)
        throw new utils_1.HttpError(400);
    yield Group_1.default.updateOne({ _id: groupId }, {
        members: [...group.members, ...userIds],
    });
    res.status(200).send({ _id: group._id });
}));
exports.renameGroup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId, name } = req.body;
    const group = yield Group_1.default.findOne({ _id: groupId });
    if (!group)
        throw new utils_1.HttpError(400);
    yield Group_1.default.updateOne({ _id: groupId }, { name });
    res.status(200).send({ _id: group._id });
}));
exports.deleteGroup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.body;
    yield Group_1.default.remove({ _id: groupId });
    res.status(201).send();
}));
