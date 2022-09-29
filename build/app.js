"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const credential_1 = __importDefault(require("./middlewares/credential"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.static(`${__dirname}/../public`));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(credential_1.default);
app.use((0, cors_1.default)(config_1.corsOptions)); // Setting up cross origin policy
app.use("/chat-app/v1", auth_1.default); // Setting up authentication router
app.get("/chat-app/v1/testing", (req, res) => {
    res.status(200).send({ message: "Ok" });
});
app.use("/chat-app/v1", user_1.default);
app.use("/chat-app/v1", chat_1.default);
app.use("*", errors_1.notFound); // Handling unknown routes
app.use(errors_1.error); // Error handling
exports.default = server;
