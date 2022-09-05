import { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import { catchAsync } from "../utils";

export const getChats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const chats = await Chat.find()
      .select("-password -confirmPassword -kind -session -__v")
      .exec();

    res.status(200).send({ chats });
  }
);

export const getMessages = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { _id } = req.query;
    const messages = await Message.find({
      $or: [
        { receiver: req.id, sender: _id },
        { sender: req.id, receiver: _id },
      ],
    });

    res.status(200).send({ messages });
  }
);

interface SendMessageResponseBody {
  receiver: string;
  text: string;
  createdAt: number;
}
