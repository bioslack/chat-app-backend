import { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";
import { catchAsync } from "../utils";

export const getChats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const chats = await Chat.find()
      .select("-password -confirmPassword -kind -session -__v")
      .exec();

    res.status(200).send({ chats });
  }
);
