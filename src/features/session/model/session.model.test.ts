import mongoose from "mongoose";
import { connect, disconnect } from "@utils/connect";
import SessionModel, { SessionInput } from "@models/session";

describe("Session model", () => {
  const sessionInput: SessionInput = {
    user: new mongoose.Types.ObjectId(),
    email: "example@email.com",
    accessToken: "accessToken",
    valid: true,
    userAgent: "userAgent",
  };
  const session = new SessionModel({ ...sessionInput });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await SessionModel.collection.drop();
    await disconnect();
  });

  it("should create a session", async () => {
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

  it("should find a session", async () => {
    // await session.save();
    const foundSession = await SessionModel.findOne({ _id: session._id });
    expect(foundSession).toBeDefined();
    expect(foundSession).toMatchObject(sessionInput);
  });

  it("should update a session", async () => {
    const sessionUpdateInput: SessionInput = {
      user: new mongoose.Types.ObjectId(),
      email: "updated-example@email.com",
      accessToken: "updatedAccessToken",
      valid: true,
      userAgent: "updatedUserAgent",
    };
    await SessionModel.updateOne({ _id: session._id }, { ...sessionUpdateInput });
    const foundSession = await SessionModel.findOne({ _id: session._id });
    expect(foundSession).toBeDefined();
    expect(foundSession).toMatchObject(sessionUpdateInput);
    expect(foundSession).not.toMatchObject(sessionInput);
  });

  it("should delete a session", async () => {
    await SessionModel.deleteOne({ _id: session._id });
    const foundSession = await SessionModel.findOne({ _id: session._id });
    expect(foundSession).toBeNull();
  });
});
