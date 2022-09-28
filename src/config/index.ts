import { CorsOptions } from "cors";

const allowedOrigins = ["http://localhost:3000", "http://192.168.3.21:3000"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin || "") || !origin) callback(null, true);
    else callback(new Error("Blocked by CORS policy"));
  },
  optionsSuccessStatus: 200,
};
