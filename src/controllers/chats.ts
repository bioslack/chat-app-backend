import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { fileURLToPath } from "url";
import Chat, { IChat } from "../models/Chat";
import Message from "../models/Message";
import { catchAsync, deleteFile, generateFileName, HttpError } from "../utils";

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

export const updateUser = catchAsync(
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
