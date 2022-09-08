import { Router } from "express";
import { getUser, getUsers } from "../controllers/users";
import restricted from "../middlewares/restricted";

const userRouter = Router();

userRouter.get("/users", restricted, getUsers);
userRouter.get("/user", restricted, getUser);

export default userRouter;
