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

  it("should fail to create a user with invalid email", async () => {
    const userInput: UserInput = {
      name: "John Doe",
      email: "email",
    };
    const user = new UserModel(userInput);

    try {
      await user.save();
    } catch (error) {
      // Check that the error is a validation error
      expect(error).toHaveProperty("name", "ValidationError");
      // Check that the error message contains the "email" field
      expect(error).toHaveProperty("message", expect.stringContaining("email"));
      return;
    }

    // If user.save() does not throw an error, fail the test
    throw new Error("Expected user.save() to fail with a validation error.");
  });
});
