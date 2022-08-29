import IChat from "./Chat";
import { IUser } from "./User";

export interface IMessage {
  text: string;
  sender: IUser;
  receiver: IChat;
  createdAt: number;
}
