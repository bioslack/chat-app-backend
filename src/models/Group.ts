import { Schema } from "mongoose";
import Chat, { IChat } from "./Chat";

export interface IGroup extends IChat {
  members: Schema.Types.ObjectId[];
  admins: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  members: {
    type: [
      {
        type: Schema.Types.ObjectId,
        body: "string",
        by: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  admins: {
    type: [
      {
        type: Schema.Types.ObjectId,
        body: "string",
        by: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
});

const Group = Chat.discriminator<IGroup>("Group", groupSchema);

export default Group;
