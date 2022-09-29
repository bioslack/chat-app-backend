"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const restricted_1 = __importDefault(require("../middlewares/restricted"));
const userRouter = (0, express_1.Router)();
userRouter.get("/users", restricted_1.default, users_1.getUsers);
userRouter.get("/user", restricted_1.default, users_1.getUser);
userRouter.get("/groups", restricted_1.default, users_1.getGroups);
exports.default = userRouter;
