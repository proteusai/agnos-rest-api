import { createUser, createUserDocument, findUser, findUserDocument, findUsers } from "@services/user";
import UserModel, { UserDocument, UserInput } from "@models/user";
import { connect, disconnect } from "@utils/connect";
import { FilterQuery } from "mongoose";

describe("User service", () => {
  const input: UserInput = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    await connect();
  });

  afterEach(async () => {
    await UserModel.collection.drop();
    await disconnect();
  });

  describe("createUser", () => {
    it("creates a user and returns the user object with password omitted", async () => {
      const user = await createUser(input);
      expect(user).toBeDefined();
      expect(user).not.toHaveProperty("password");
      expect(user).toMatchObject(expect.objectContaining({ name: input.name, email: input.email }));
    });

    it("should not create multiple users with the same email", async () => {
      await expect(createUser(input)).resolves.toBeDefined();
      await expect(createUser(input)).rejects.toThrow();
    });
  });

  describe("createUserDocument", () => {
    it("creates a user document and returns the document", async () => {
      const userDoc = await createUserDocument(input);
      expect(userDoc).toBeDefined();
      expect(userDoc).toHaveProperty("name", input.name);
      expect(userDoc).toHaveProperty("email", input.email);
    });
  });

  describe("findUser", () => {
    it("finds a user matching the query and returns a plain object", async () => {
      await createUserDocument(input);
      const query: FilterQuery<UserDocument> = { name: input.name };
      const user = await findUser(query);
      expect(user).toBeDefined();
      expect(user).toMatchObject(expect.objectContaining({ name: input.name, email: input.email }));
      expect(user).not.toBeInstanceOf(UserModel);
    });
  });

  describe("findUserDocument", () => {
    it("finds a user matching the query and returns a user document", async () => {
      await createUserDocument(input);
      const query: FilterQuery<UserDocument> = { name: input.name };
      const user = await findUserDocument(query);
      expect(user).toBeDefined();
      expect(user).toBeInstanceOf(UserModel);
      expect(user).toHaveProperty("name", input.name);
      expect(user).toHaveProperty("email", input.email);
    });
  });

  describe("findUsers", () => {
    it("finds all users matching the query and returns an array of plain objects", async () => {
      const input1: UserInput = {
        name: "testuser1",
        email: "johndo1e@example.com",
      };
      const input2: UserInput = {
        name: "testuser2",
        email: "johndoe2@example.com",
      };
      await createUserDocument(input1);
      await createUserDocument(input2);
      const query: FilterQuery<UserDocument> = { name: { $regex: /testuser/ } };
      const users = await findUsers(query);
      expect(users).toBeDefined();
      expect(users).toHaveLength(2);
      expect(users[0]).toMatchObject({ name: input1.name });
      expect(users[1]).toMatchObject({ name: input2.name });
    });
  });
});
