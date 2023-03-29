import { createSessionSchema } from "./session.schema";

describe("Create session schema", () => {
  it("should validate well-formed objects", async () => {
    expect(() => {
      createSessionSchema.parse({
        body: {
          email: "example@email.com",
          accessToken: "accessToken",
          idToken: "idToken",
        },
      });
    }).not.toThrowError();
  });

  it("should not validate malformed objects", async () => {
    // no email
    expect(() => {
      createSessionSchema.parse({
        body: {
          accessToken: "accessToken",
          idToken: "idToken",
        },
      });
    }).toThrowError();

    // no access token
    expect(() => {
      createSessionSchema.parse({
        body: {
          email: "example@email.com",
          idToken: "idToken",
        },
      });
    }).toThrowError();

    // no ID token
    expect(() => {
      createSessionSchema.parse({
        body: {
          email: "example@email.com",
          accessToken: "accessToken",
        },
      });
    }).toThrowError();

    // invalid email
    expect(() => {
      createSessionSchema.parse({
        body: {
          email: "email",
          accessToken: "accessToken",
          idToken: "idToken",
        },
      });
    }).toThrowError();
  });
});
