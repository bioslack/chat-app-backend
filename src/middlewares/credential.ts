import { Request, Response, NextFunction } from "express";

const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:8888",
];

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
};

export default credentials;
