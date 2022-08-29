import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Chat, { IChat } from "./Chat";

export interface IUser extends IChat {
  email: string;
  password: string;
  confirmPassword: string;
  session: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A valid e-mail is required"],
  },
  password: {
    type: String,
    minlength: [8, "A password with at least 8 characters is required"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirmation password is required"],
  },
  picture: {
    type: String,
    default: "default.png",
  },
  session: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(`${this.password}`, 12);
  this.confirmPassword = "";
  next();
});

const User = Chat.discriminator<IUser>("User", userSchema);

export default User;
