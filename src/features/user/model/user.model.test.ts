import bcrypt from "bcrypt";
import { connect, disconnect } from "@utils/connect";
import UserModel, { UserInput, UserDocument } from "@models/user";

describe("User Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.collection.drop();
    await disconnect();
  });

  it("should hash the password before saving the user", async () => {
    const userInput: UserInput = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const user = new UserModel(userInput);

    await user.save();

    const savedUser = await UserModel.findOne({ email: userInput.email });

    expect(savedUser).toBeDefined();
    expect(savedUser?.password).not.toBe(userInput.password);
    await expect(bcrypt.compare(userInput.password as string, savedUser?.password as string)).resolves.toBe(true);
  });

  it("should compare the password correctly", async () => {
    const userInput: UserInput = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    };

    const user = new UserModel(userInput);

    await user.save();

    const isMatch = await (user as UserDocument).comparePassword(userInput.password as string);

    expect(isMatch).toBe(true);
  });
});
