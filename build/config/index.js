"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins = ["http://localhost:3000", "http://192.168.3.21:3000"];
exports.corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin || "") || !origin)
            callback(null, true);
        else
            callback(new Error("Blocked by CORS policy"));
    },
    optionsSuccessStatus: 200,
};
