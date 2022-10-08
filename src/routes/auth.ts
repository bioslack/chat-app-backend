import { Router } from "express";
import { logout, refresh, signin, signup } from "../controllers/auth";
import { signinValidator, signupValidator } from "../middlewares/validators";

const authRouter = Router();
authRouter.post("/auth/signup", signupValidator(), signup);
authRouter.post("/auth/signin", signinValidator(), signin);
authRouter.get("/auth/refresh", refresh);
authRouter.delete("/auth/logout", logout);

export default authRouter;
