import { Router } from "express";
import {
  addUsersToGroup,
  createGroup,
  deleteGroup,
  renameGroup,
} from "../controllers/groups";
import restricted from "../middlewares/restricted";
import {
  addUsersToGroupValidator,
  createGroupValidator,
  renameGroupValidator,
} from "../middlewares/validators";

const groupRouter = Router();

groupRouter.use(restricted);
groupRouter.post("/group", createGroupValidator(), createGroup);
groupRouter.patch("/group/add", addUsersToGroupValidator(), addUsersToGroup);
groupRouter.patch("/group/rename", renameGroupValidator(), renameGroup);
groupRouter.delete("/group", deleteGroup);

export default groupRouter;
