import User from "../models/User";
import { generateToken } from "../utils";

describe("Testing generate tokens", () => {
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
});
