import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import User from "../models/User";
import fs from "fs";
import { generateToken, deleteFile } from "../utils";

describe("Testing generate tokens", () => {
  beforeAll(() => {
    fs.writeFile(
      `${__dirname}/../../public/img/testing.txt`,
      "Hello World\n",
      () => {}
    );
  });

  afterAll(() => {
    fs.unlink(`${__dirname}/../../public/img/testing.txt`, () => {});
  });

  it("Should generate tokens", () => {
    const token = generateToken(
      new User({
        name: "Luis Pereira",
        email: "pereira.luishm@gmail.com",
        password: "12345678",
        confirmPassword: "",
        createdAt: Date.now(),
        picture: "",
      })
    );

    expect(Object.keys(token).length).toBe(2);
  });

  it("Should delete a file", async () => {
    await deleteFile("testing.txt");
    const exists = fs.existsSync(`${__dirname}/../../public/img/testing.txt`);
    expect(exists).toBeTruthy();
  });
});
