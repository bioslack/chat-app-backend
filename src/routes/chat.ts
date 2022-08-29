import { Router } from "express";
import { getChats } from "../controllers/chats";
import restricted from "../middlewares/restricted";

const chatRouter = Router();

chatRouter.get("/chats", restricted, getChats);

export default chatRouter;
