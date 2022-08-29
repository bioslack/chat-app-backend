import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { catchAsync, decodeToken, getAuthorization } from "../utils";

export const getUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { _id } = decodeToken(getAuthorization(req));
    const users = await User.find({ _id: { $ne: _id } });
    // const users = await User.find();

    res.status(200).send({
      users: users.map((u) => {
        u.session = "";
        u.password = "";
        return u;
      }),
    });
  }
);
