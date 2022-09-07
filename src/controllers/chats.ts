import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { fileURLToPath } from "url";
import Chat from "../models/Chat";
import Message from "../models/Message";
import { catchAsync, generateFileName, HttpError } from "../utils";

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

export const imageUploader = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const chat = await Chat.findByIdAndUpdate(
      req.id,
      { $set: { picture: req.filename } },
      { new: true, runValidators: true }
    );
    console.log(req.filename);
    res.status(200).send("Uploaded");
  }
);

interface SendMessageResponseBody {
  receiver: string;
  text: string;
  createdAt: number;
}
