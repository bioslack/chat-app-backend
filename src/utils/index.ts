import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { unlink } from "fs/promises";
import User, { IUser } from "../models/User";
import { Types } from "mongoose";
import { createHash } from "crypto";

config({
  path: ".env",
});

enum HttpErrorStatus {
  ERROR_400 = "400",
  ERROR_401 = "401",
  ERROR_403 = "403",
  ERROR_404 = "404",
  ERROR_405 = "405",
  ERROR_500 = "500",
}

interface IError {
  title: string;
  message: string;
}

type ErrorMessages = { [e in HttpErrorStatus]: IError };

const errorMessages: ErrorMessages = {
  "400": {
    title: "Bad request",
    message: "Incorrect data",
  },
  "401": {
    title: "Unauthorized",
    message: "Authentication required",
  },
  "403": {
    title: "Forbidden",
    message: "Cannot access this route",
  },
  "404": {
    title: "Not found",
    message: "There's no such route",
  },
  ["405"]: {
    title: "Method Not Allowed",
    message: "Method Not Allowed",
  },
  "500": {
    title: "Internal server error",
    message: "System is down",
  },
};

type HttpStatus = 400 | 401 | 403 | 404 | 405 | 500;

export class HttpError extends Error {
  statusCode: number;
  message: string;
  title: string;

  constructor(statucode: HttpStatus, message: string | undefined = undefined) {
    super(errorMessages[`${statucode}`].message);
    this.statusCode = statucode;
    this.message = message || errorMessages[statucode].message;
    this.title = errorMessages[statucode].title;
    Error.captureStackTrace(this, this.constructor);
  }
}

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export const catchAsync = function (fn: AsyncRequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

interface SignedTokens {
  access: string;
  refresh: string;
}

export const generateToken = (
  user: IUser & { _id: Types.ObjectId }
): SignedTokens => {
  if (!process.env.ACCESS_TOKEN_SECRET) throw new HttpError(500);
  if (!process.env.REFRESH_TOKEN_SECRET) throw new HttpError(500);

  const access = jwt.sign(
    {
      name: user.name,
      email: user.email,
      picture: user.picture,
      createdAt: user.createdAt,
      _id: user._id.toString(),
    },
    process.env.ACCESS_TOKEN_SECRET
  );
  const refresh = jwt.sign(
    {
      name: user.name,
      email: user.email,
      picture: user.picture,
      createdAt: user.createdAt,
      _id: user._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  return { access, refresh };
};

export const setRefreshToken = (res: Response, refresh: string) => {
  res.cookie("jwt", refresh, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshToken = (res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

export const setSession = async (
  user: IUser & { _id: Types.ObjectId },
  refresh: string
) => {
  await User.updateOne(
    { _id: { $eq: user._id } },
    {
      session: refresh,
    }
  );
};

export const deleteSession = async (session?: string) => {
  if (session)
    await User.updateOne(
      { session: { $eq: session } },
      {
        session: "",
      }
    );
};

export const getAuthorization = (req: Request) => {
  const authorization = req.get("authorization");
  if (!authorization) throw new HttpError(401);
  if (authorization.split(" ").length !== 2) throw new HttpError(400);

  return authorization.split(" ")[1];
};

interface DecodedUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  createdAt: number;
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as DecodedUser;
};

export const generateFileName = () => {
  const md5 = createHash("md5");
  md5.update(`${Date.now()}`);
  const buffer = md5.digest();
  return buffer.toString("hex");
};

export const deleteFile = async (filename: string) => {
  await unlink(`${__dirname}/../../public/img/${filename}`);
};
