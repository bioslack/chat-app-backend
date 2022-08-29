import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/User";
import {
  catchAsync,
  clearRefreshToken,
  deleteSession,
  generateToken,
  HttpError,
  setRefreshToken,
  setSession,
} from "../utils";

config({
  path: ".env",
});

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newUser = await User.create(req.body);
    const { access, refresh } = generateToken(newUser);
    await setSession(newUser, refresh);
    setRefreshToken(res, refresh);
    res.status(200).send({ access });
  }
);

export const signin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { password, email } = req.body;

    const found = await User.findOne({ email });
    if (!found) throw new HttpError(400);

    if (!(await bcrypt.compare(password, found.password)))
      throw new HttpError(401, "Wrong credentials");

    const { access, refresh } = generateToken(found);
    await setSession(found, refresh);
    setRefreshToken(res, refresh);

    res.status(200).send({ access });
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    await deleteSession(req.cookies?.jwt);
    clearRefreshToken(res);
    res.status(204).send();
  }
);

export const refresh = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    console.log(req.cookies);
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new HttpError(401, "Invalid token");

    const found = await User.findOne({ session: cookies.jwt });
    if (!found) throw new HttpError(401, "User not found");

    const oldRefresh = cookies.jwt;
    if (!process.env.REFRESH_TOKEN_SECRET) throw new HttpError(500);
    if (!jwt.verify(oldRefresh, process.env.REFRESH_TOKEN_SECRET))
      throw new HttpError(401, "Invalid token");

    clearRefreshToken(res);

    const { access, refresh } = generateToken(found);
    setSession(found, refresh);
    setRefreshToken(res, refresh);

    res.status(200).send({ access });
  }
);
