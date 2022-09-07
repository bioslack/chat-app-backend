import { Router } from "express";
import { getChats, getMessages, imageUploader, upload } from "../controllers/chats";
import restricted from "../middlewares/restricted";

const chatRouter = Router();

chatRouter.get("/chats", restricted, getChats);
chatRouter.get("/chats/messages", restricted, getMessages);
chatRouter.patch("/chat", upload.single("picture"), imageUploader);

export default chatRouter;
