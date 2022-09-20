import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config";
import credentials from "./middlewares/credential";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import chatRouter from "./routes/chat";
import { error, notFound } from "./middlewares/errors";

const app = express();
const server = http.createServer(app);

app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions)); // Setting up cross origin policy
app.use("/chat-app/v1", authRouter); // Setting up authentication router
app.get("/chat-app/v1/testing", (req, res) => {
  res.status(200).send({ message: "Ok" });
});
app.use("/chat-app/v1", userRouter);
app.use("/chat-app/v1", chatRouter);
app.use("*", notFound); // Handling unknown routes
app.use(error); // Error handling

export default server;
