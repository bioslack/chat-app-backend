import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";
import request from "supertest";
import crypto from "crypto";
import app from "../app";
import User from "../models/User";
import { generateToken } from "../utils";
import Group from "../models/Group";

const fakeId = () => crypto.randomBytes(12).toString("hex");

const api = request(app);

let accessToken = "";
let groupId = "";

describe("Testing signup route", () => {
  beforeEach(async () => {
    const uri = (
      await MongoMemoryServer.create({
        binary: { version: "4.4.4", systemBinary: "/usr/bin/mongod" },
      })
    ).getUri();
    await connect(uri);

    const user = new User({
      name: "Jonh Doe",
      email: "jonhdoe@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    const group = new Group({
      name: "Grupo 2",
      members: [fakeId()],
      admin: [fakeId()],
    });

    groupId = group._id.toString();

    await user.save();
    await group.save();

    const { access } = generateToken(user);
    accessToken = access;
  });

  afterEach(async () => {
    await disconnect();
  });

  it("Should create a new group", async () => {
    const res = await api
      .post("/chat-app/v1/group/")
      .set("authorization", `Bearer ${accessToken}`)
      .send({
        name: "Grupo",
        admins: [fakeId()],
        members: [fakeId()],
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should add a user in a group", async () => {
    const res = await api
      .patch("/chat-app/v1/group/add/")
      .set("authorization", `Bearer ${accessToken}`)
      .send({
        groupId: groupId,
        userIds: [fakeId(), fakeId(), fakeId()],
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should fail since no user was provided", async () => {
    const res = await api
      .patch("/chat-app/v1/group/add/")
      .set("authorization", `Bearer ${accessToken}`)
      .send({
        groupId: groupId,
        userIds: [],
      });

    expect(res.statusCode).toBe(400);
  });

  it("Should succeeds as valid request was provided", async () => {
    const res = await api
      .patch("/chat-app/v1/group/rename/")
      .set("authorization", `Bearer ${accessToken}`)
      .send({
        groupId: groupId,
        name: "Group 3",
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should deletes a group", async () => {
    const res = await api
      .delete("/chat-app/v1/group")
      .set("authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(201);
  });
});
