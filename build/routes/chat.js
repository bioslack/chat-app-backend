"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chats_1 = require("../controllers/chats");
const restricted_1 = __importDefault(require("../middlewares/restricted"));
const chatRouter = (0, express_1.Router)();
chatRouter.post("/chat", restricted_1.default, chats_1.upload.single("picture"), chats_1.createGroup);
chatRouter.get("/chats", restricted_1.default, chats_1.getChats);
chatRouter.get("/chats/messages", restricted_1.default, chats_1.getMessages);
chatRouter.get("/chat/participants", restricted_1.default, chats_1.getChatParticipants);
chatRouter.patch("/chat", restricted_1.default, chats_1.upload.single("picture"), chats_1.updateChat);
chatRouter.delete("/chat/picture", restricted_1.default, chats_1.removePicture);
exports.default = chatRouter;
