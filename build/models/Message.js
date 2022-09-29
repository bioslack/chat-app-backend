"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Message;
