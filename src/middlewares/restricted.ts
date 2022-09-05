import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError, decodeToken } from "../utils";

const restricted = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get("authorization");

  if (!authorization) throw new HttpError(401, "Authentication required");
  const token = authorization.split(" ")[1];

  if (!process.env.ACCESS_TOKEN_SECRET) throw new HttpError(500);
  if (!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET))
    throw new HttpError(401, "Authentication token has expired");

  const { _id: id } = decodeToken(token);
  req.id = id;

  next();
};

export default restricted;
