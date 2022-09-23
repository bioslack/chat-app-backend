import { Request, Response, NextFunction } from "express";
import Group from "../models/Group";
import User from "../models/User";
import { catchAsync } from "../utils";

export const getUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const users = await User.find({
      _id: { $ne: req.id },
      name: { $regex: req.query.name, $options: "i" },
    });
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

export const getUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findOne({ _id: req.id });
    res.status(200).send({ user });
  }
);

export const getGroups = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const groups = await Group.find({ members: req.id });
    res.status(200).send({ groups });
  }
);
