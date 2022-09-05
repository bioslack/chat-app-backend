import { Schema, model } from "mongoose";
import { IChat } from "./Chat";
import { IUser } from "./User";

export interface IMessage {
  text: string;
  sender: IUser;
  receiver: IChat;
  createdAt: number;
}

const messageSchema = new Schema<IMessage>({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
  },
  receiver: {
    type: Schema.Types.ObjectId,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

const Message = model("Message", messageSchema);

export default Message;
