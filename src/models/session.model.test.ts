import mongoose from "mongoose";
import { connect, disconnect } from "../utils/connect";
import SessionModel, { SessionInput } from "./session.model";

describe("Session model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await SessionModel.collection.drop();
    await disconnect();
  });

  it("should create a session", async () => {
    const sessionInput: SessionInput = {
      user: new mongoose.Types.ObjectId(),
      email: "example@email.com",
      accessToken: "accessToken",
      valid: true,
      userAgent: "userAgent",
    };
    const session = new SessionModel({ ...sessionInput });
    const createdSession = await session.save();
    expect(createdSession).toBeDefined();
    expect(createdSession.user).toBe(session.user);
    expect(createdSession.email).toBe(session.email);
    expect(createdSession.accessToken).toBe(session.accessToken);
    expect(createdSession.valid).toBe(session.valid);
    expect(createdSession.userAgent).toBe(session.userAgent);
    expect(createdSession._id).toBeDefined();
    expect(createdSession.createdAt).toBeDefined();
    expect(createdSession.updatedAt).toBeDefined();
  });

  it("should fail to create a session with invalid email", async () => {
    const sessionInput: SessionInput = {
      user: new mongoose.Types.ObjectId(),
      email: "email",
      accessToken: "accessToken",
      valid: true,
      userAgent: "userAgent",
    };
    const session = new SessionModel({ ...sessionInput });

    try {
      await session.save();
    } catch (error) {
      // Check that the error is a validation error
      expect(error).toHaveProperty("name", "ValidationError");
      // Check that the error message contains the "email" field
      expect(error).toHaveProperty("message", expect.stringContaining("email"));
      return;
    }

    // If session.save() does not throw an error, fail the test
    throw new Error("Expected session.save() to fail with a validation error.");
  });
});
