import Message from "../models/Message";
import { Server, Socket } from "socket.io";
import app from "../app";

interface IMessage {
  _id?: string;
  text: string;
  receiver: string;
  sender: string;
  createdAt: number;
}

interface SocketChat {
  send: (message: IMessage) => void;
}

class UserChat implements SocketChat {
  _id: string;
  socket: Socket;

  constructor(_id: string, socket: Socket) {
    this._id = _id;
    this.socket = socket;
  }

  send(message: IMessage) {
    this.socket.emit("receive-message", message);
  }

  sendConnectedUsers(usersId: string[]) {
    this.socket.emit("users-list", usersId);
  }
}

class GroupChat implements SocketChat {
  _id: string;
  users: UserChat[];

  constructor(_id: string) {
    this._id = _id;
    this.users = [];
  }

  add(user: UserChat) {
    this.users = [...this.users.filter((u) => u._id !== user._id), user];
  }

  send(message: IMessage) {
    this.users
      .filter((u) => u._id !== message.sender)
      .forEach((u) => u.send(message));
  }
}

class ServerSocket {
  users: UserChat[];
  groups: GroupChat[];

  constructor() {
    this.users = [];
    this.groups = [];

    const io = new Server(app, {
      cors: {
        origin: ["http://localhost:3000"],
      },
    });

    const self = this;

    io.on("connection", (socket) => {
      socket.on("user-connected", (id: string, groupsId: string[]) => {
        self.add(new UserChat(id, socket), groupsId);
        console.log(
          "<<< Groups >>>",
          this.groups.map((g) => g.users)
        );
      });

      socket.on("send-message", (message: IMessage) => {
        Message.create({ ...message, _id: undefined });

        const user = self.users.find((u) => u._id === message.receiver);
        if (user) return user.send(message);

        const group = self.groups.find((g) => g._id === message.receiver);
        if (group) return group.send(message);
      });

      socket.on("disconnect", () => {
        self.remove(socket.id);
      });
    });
  }

  add(user: UserChat, groupsId: string[]) {
    const unique = groupsId
      .filter((gid) => !this.groups.map((g) => g._id).includes(gid))
      .map((gid) => new GroupChat(gid));
    this.groups = [...this.groups, ...unique];

    this.users = [...this.users.filter((u) => u._id !== user._id), user];

    this.groups.forEach((group) => {
      if (groupsId.includes(group._id)) group.add(user);
    });
    this.broadcastConnectedUsersList();
  }

  remove(socketId: string) {
    this.users = this.users.filter((u) => u.socket.id !== socketId);
    this.broadcastConnectedUsersList();
  }

  broadcastConnectedUsersList() {
    const usersId = this.users.map((u) => u._id);
    this.users.forEach((u) => u.sendConnectedUsers(usersId));
  }
}

new ServerSocket();
