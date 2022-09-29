"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("../models/Message"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("../app"));
class UserChat {
    constructor(_id, socket) {
        this._id = _id;
        this.socket = socket;
    }
    send(message) {
        this.socket.emit("receive-message", message);
    }
    sendConnectedUsers(usersId) {
        this.socket.emit("users-list", usersId);
    }
}
class GroupChat {
    constructor(_id) {
        this._id = _id;
        this.users = [];
    }
    add(user) {
        this.users = [...this.users.filter((u) => u._id !== user._id), user];
    }
    send(message) {
        this.users
            .filter((u) => u._id !== message.sender)
            .forEach((u) => u.send(message));
    }
}
class ServerSocket {
    constructor() {
        this.users = [];
        this.groups = [];
        const io = new socket_io_1.Server(app_1.default, {
            cors: {
                origin: ["http://localhost:3000", "http://192.168.3.21:3000"],
            },
        });
        const self = this;
        io.on("connection", (socket) => {
            socket.on("user-connected", (id, groupsId) => {
                self.add(new UserChat(id, socket), groupsId);
                console.log("<<< Groups >>>", this.groups.map((g) => g.users));
            });
            socket.on("send-message", (message) => {
                Message_1.default.create(Object.assign(Object.assign({}, message), { _id: undefined }));
                const user = self.users.find((u) => u._id === message.receiver);
                if (user)
                    return user.send(message);
                const group = self.groups.find((g) => g._id === message.receiver);
                if (group)
                    return group.send(message);
            });
            socket.on("disconnect", () => {
                self.remove(socket.id);
            });
        });
    }
    add(user, groupsId) {
        const unique = groupsId
            .filter((gid) => !this.groups.map((g) => g._id).includes(gid))
            .map((gid) => new GroupChat(gid));
        this.groups = [...this.groups, ...unique];
        this.users = [...this.users.filter((u) => u._id !== user._id), user];
        this.groups.forEach((group) => {
            if (groupsId.includes(group._id))
                group.add(user);
        });
        this.broadcastConnectedUsersList();
    }
    remove(socketId) {
        this.users = this.users.filter((u) => u.socket.id !== socketId);
        this.broadcastConnectedUsersList();
    }
    broadcastConnectedUsersList() {
        const usersId = this.users.map((u) => u._id);
        this.users.forEach((u) => u.sendConnectedUsers(usersId));
    }
}
new ServerSocket();
