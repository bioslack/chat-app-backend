import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { HttpError } from "../utils";

export const error: ErrorRequestHandler = (err, _req, res, _next) => {
  let error = { ...err, message: err.message };

  // console.log(error);

  if (error.code && error.code === 11000)
    error = new HttpError(400, "Duplicate user");

  if (error.name && error.name === "ValidationError")
    error = new HttpError(400, "Invalid data");

  if (error.name && error.name === "JsonWebTokenError")
    error = new HttpError(401, "Invalid token");

  return res.status(error.statusCode).json({
    message: error.message,
    statusCode: error.statusCode,
  });
};

export const notFound = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {
  throw new HttpError(404);
};
