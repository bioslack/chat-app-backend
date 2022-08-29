import { Router } from "express";
import { getUsers } from "../controllers/users";
import restricted from "../middlewares/restricted";

const userRouter = Router();

userRouter.get("/users", restricted, getUsers);

export default userRouter;
