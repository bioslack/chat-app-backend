import { Router } from "express";
import {
  getChats,
  getMessages,
  updateChat,
  upload,
  removePicture,
  createGroup
} from "../controllers/chats";
import restricted from "../middlewares/restricted";

const chatRouter = Router();

chatRouter.post("/chat", restricted, upload.single("picture"), createGroup);
chatRouter.get("/chats", restricted, getChats);
chatRouter.get("/chats/messages", restricted, getMessages);
chatRouter.patch("/chat", restricted, upload.single("picture"), updateChat);
chatRouter.delete("/chat/picture", restricted, removePicture);

export default chatRouter;
