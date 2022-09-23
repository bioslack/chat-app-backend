import { Router } from "express";
import { getUser, getUsers, getGroups } from "../controllers/users";
import restricted from "../middlewares/restricted";

const userRouter = Router();

userRouter.get("/users", restricted, getUsers);
userRouter.get("/user", restricted, getUser);
userRouter.get("/groups", restricted, getGroups);

export default userRouter;
