"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Chat_1 = __importDefault(require("./Chat"));
const groupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    members: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                body: "string",
                by: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    admins: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                body: "string",
                by: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
});
const Group = Chat_1.default.discriminator("Group", groupSchema);
exports.default = Group;
