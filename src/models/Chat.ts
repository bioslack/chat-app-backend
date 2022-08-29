import { model, Schema } from "mongoose";

export interface IChat {
  name: string;
  picture: string;
  createdAt: number;
  kind: "User" | "Group";
}

const chatSchema = new Schema<IChat>(
  {
    name: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  {
    discriminatorKey: "kind",
  }
);

const Chat = model("Chat", chatSchema);

export default Chat;
