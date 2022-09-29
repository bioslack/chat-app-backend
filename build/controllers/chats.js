"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = exports.removePicture = exports.updateChat = exports.upload = exports.getChatParticipants = exports.getMessages = exports.getChats = void 0;
const Group_1 = __importDefault(require("../models/Group"));
const multer_1 = __importDefault(require("multer"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const utils_1 = require("../utils");
exports.getChats = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, search } = req.query;
    const senders = yield Message_1.default.find({
        $or: [{ receiver: req.id }, { sender: req.id }],
    }).distinct("sender");
    const receivers = yield Message_1.default.find({
        $or: [{ receiver: req.id }, { sender: req.id }],
    }).distinct("receiver");
    const filter = !search
        ? {
            $or: [
                { $or: [{ _id: { $in: senders } }, { _id: { $in: receivers } }] },
                { members: req.id, kind: "Group" },
            ],
        }
        : {
            $or: [
                { name: { $regex: search, $options: "i" }, kind: "User" },
                {
                    name: { $regex: search, $options: "i" },
                    members: req.id,
                    kind: "Group",
                },
            ],
        };
    const query = Chat_1.default.find(filter).select("-password -confirmPassword -kind -session -__v");
    query.skip((+page - 1) * +limit).limit(+limit);
    const chats = yield query.exec();
    res.status(200).send({ chats });
}));
exports.getMessages = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, group_id } = req.query;
    let filter = {};
    if (!group_id) {
        filter = {
            $or: [
                { receiver: req.id, sender: _id },
                { sender: req.id, receiver: _id },
            ],
        };
    }
    else {
        filter = { $and: [{ receiver: group_id }] };
    }
    const messages = yield Message_1.default.find(filter);
    res.status(200).send({ messages });
}));
exports.getChatParticipants = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { participants } = req.query;
    const participantsMap = (yield Chat_1.default.find({ _id: { $in: JSON.parse(`${participants}`) } })).map((user) => ({ id: user._id, name: user.name }));
    return res.status(200).send({ participants: participantsMap });
}));
const storage = multer_1.default.diskStorage({
    destination: (req, _file, cb) => {
        if (!req.id) {
            cb(new utils_1.HttpError(400), "");
        }
        else {
            cb(null, `${__dirname}/../../public/img/`);
        }
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const filename = `${(0, utils_1.generateFileName)()}.${ext}`;
        req.filename = filename;
        cb(null, filename);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new utils_1.HttpError(400, "Only images is accepted"));
        }
    },
});
exports.updateChat = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const chatData = {
        name: req.body.name,
    };
    if (req.filename) {
        const old = yield Chat_1.default.findOne({ _id: req.id });
        if ((old === null || old === void 0 ? void 0 : old.picture) && old.picture !== "default.png") {
            console.log(old.picture);
            yield (0, utils_1.deleteFile)(old.picture);
        }
        chatData.picture = req.filename;
    }
    const chat = yield Chat_1.default.findByIdAndUpdate(req.id, { $set: chatData }, { new: true, runValidators: true });
    res.status(200).send("Uploaded");
}));
exports.removePicture = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = yield Chat_1.default.findOne({ _id: req.id });
    if (!chat)
        throw new utils_1.HttpError(400);
    if (chat.picture !== "default.png") {
        (0, utils_1.deleteFile)(chat.picture);
        yield Chat_1.default.findByIdAndUpdate(req.id, { $set: { picture: "default.png" } }, { new: true, runValidators: true });
    }
    return res.status(201).send();
}));
exports.createGroup = (0, utils_1.catchAsync)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    yield Group_1.default.create(Object.assign(Object.assign({}, req.body), { picture: req.filename, 
        // @ts-ignore
        members: JSON.parse([...req.body.members, req.id]) }));
    res.status(200).send({ message: "success" });
}));
