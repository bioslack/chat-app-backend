"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" });
const MONGO_URI = (((_a = process.env) === null || _a === void 0 ? void 0 : _a.MONGO_HOST) || "").replace("<password>", ((_b = process.env) === null || _b === void 0 ? void 0 : _b.MONGO_PW) || "");
(0, mongoose_1.connect)(MONGO_URI, {
    socketTimeoutMS: 10000,
})
    .then(() => console.log("Connected with MongoDB successfully"))
    .catch((err) => console.error("Failed to connected to MongoDB", err));
