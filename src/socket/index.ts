import { Server, Socket } from "socket.io";
import app from "../app";

const io = new Server(app, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

class UserConnection {
  _id: string;
  socket: Socket;

  constructor(_id: string, socket: Socket) {
    this._id = _id;
    this.socket = socket;
  }
}

class UsersPool {
  pool: UserConnection[];

  constructor() {
    this.pool = [];
  }

  add(id: string, socket: Socket) {
    if (this.pool.filter((u) => u._id === id).length) return;
    this.pool = [...this.pool, new UserConnection(id, socket)];
    this.pool
      .map((u) => u.socket)
      .forEach((s) =>
        s.emit(
          "users-list",
          this.pool.map((u) => u._id)
        )
      );
  }

  remove(socket: Socket) {
    this.pool = this.pool.filter((u) => u.socket.id !== socket.id);
    this.pool
      .map((u) => u.socket)
      .forEach((s) =>
        s.emit(
          "users-list",
          this.pool.map((u) => u._id)
        )
      );
  }
}

const users = new UsersPool();

io.on("connection", (socket) => {
  socket.on("user-connected", (id: string) => {
    users.add(id, socket);
  });

  socket.on("disconnect", () => {
    users.remove(socket);
  });
});
