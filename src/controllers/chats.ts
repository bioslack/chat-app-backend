import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import Group from "../models/Group";
import multer from "multer";
import Chat, { IChat } from "../models/Chat";
import Message from "../models/Message";
import { catchAsync, deleteFile, generateFileName, HttpError } from "../utils";

export const getChats = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const senders = await Message.find({
      $or: [{ receiver: req.id }, { sender: req.id }],
    }).distinct("sender");
    const receivers = await Message.find({
      $or: [{ receiver: req.id }, { sender: req.id }],
    }).distinct("receiver");

    console.log(senders, receivers);

    const chats = await Chat.find({
      $or: [
        { _id: { $in: senders } },
        { _id: { $in: receivers } },
        { $and: [{ kind: "Group" }, { members: req.id }] },
      ],
    })
      .select("-password -confirmPassword -kind -session -__v")
      .exec();

    console.log(chats);

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

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    if (!req.id) {
      cb(new HttpError(400), "");
    } else {
      cb(null, `${__dirname}/../../public/img/`);
    }
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const filename = `${generateFileName()}.${ext}`;
    req.filename = filename;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpError(400, "Only images is accepted"));
    }
  },
});

export const updateChat = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const chatData: Partial<IChat> = {
      name: req.body.name,
    };

    if (req.filename) {
      const old = await Chat.findOne({ _id: req.id });
      if (old?.picture && old.picture !== "default.png") {
        console.log(old.picture);
        await deleteFile(old.picture);
      }
      chatData.picture = req.filename;
    }

    const chat = await Chat.findByIdAndUpdate(
      req.id,
      { $set: chatData },
      { new: true, runValidators: true }
    );
    res.status(200).send("Uploaded");
  }
);

export const removePicture = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const chat = await Chat.findOne({ _id: req.id });

    if (!chat) throw new HttpError(400);

    if (chat.picture !== "default.png") {
      deleteFile(chat.picture);
      await Chat.findByIdAndUpdate(
        req.id,
        { $set: { picture: "default.png" } },
        { new: true, runValidators: true }
      );
    }

    return res.status(201).send();
  }
);

export const createGroup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    await Group.create({
      ...req.body,
      picture: req.filename,
      // @ts-ignore
      members: JSON.parse([...req.body.members, req.id]),
    });
    res.status(200).send({ message: "success" });
  }
);
