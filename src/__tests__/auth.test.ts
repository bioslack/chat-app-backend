import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";
import request from "supertest";
import app from "../app";
import User from "../models/User";

const api = request(app);

describe("Testing signup route", () => {
  beforeEach(async () => {
    const uri = (
      await MongoMemoryServer.create({
        binary: { version: "4.4.4", systemBinary: "C://Program Files/MongoDB/Server/6.0/bin/mongodb.exe" },
      })
    ).getUri();
    await connect(uri);
    await User.create({
      name: "Jonh Doe",
      email: "jonhdoe@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
    });
  });

  afterEach(async () => {
    await disconnect();
  });

  it("Should return 200 HTTP status", async () => {
    const res = await api.post("/chat-app/v1/auth/signup/").send({
      name: "Luis Pereira",
      email: "pereira.luishm@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(res.statusCode).toBe(200);
  });

  it("Should fail since the user email has been registered already", async () => {
    const res = await api.post("/chat-app/v1/auth/signup/").send({
      name: "Jonh Doe",
      email: "jonhdoe@gmail.com",
      password: "12345678",
      confirmPassword: "12345678",
    });

    expect(res.statusCode).toBe(400);
  });

  it("Should fail since mandatory data hasn't been provided", async () => {
    const res = await api.post("/chat-app/v1/auth/signup/").send({
      name: "Luis Pereira",
      email: "pereira.luishm@gmail.com",
      password: "12345678",
    });

    expect(res.statusCode).toBe(400);
  });
});
