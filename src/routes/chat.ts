import { Router } from "express";
import { getChats, getMessages } from "../controllers/chats";
import restricted from "../middlewares/restricted";

const chatRouter = Router();

chatRouter.get("/chats", restricted, getChats);
chatRouter.get("/chats/messages", restricted, getMessages);

export default chatRouter;
