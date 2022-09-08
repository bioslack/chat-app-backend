import { Router } from "express";
import {
  getChats,
  getMessages,
  updateUser,
  upload,
} from "../controllers/chats";
import restricted from "../middlewares/restricted";

const chatRouter = Router();

chatRouter.get("/chats", restricted, getChats);
chatRouter.get("/chats/messages", restricted, getMessages);
chatRouter.patch("/chat", restricted, upload.single("picture"), updateUser);

export default chatRouter;
