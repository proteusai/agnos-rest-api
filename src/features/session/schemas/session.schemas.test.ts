import { CreateSessionRequest, createSessionSchema } from "@schemas/session";

describe("Create session schema", () => {
  it("should validate well-formed objects", async () => {
    const request: CreateSessionRequest = {
      body: {
        email: "example@email.com",
        accessToken: "accessToken",
        idToken: "idToken",
      },
    };
    expect(() => {
      createSessionSchema.parse(request);
    }).not.toThrowError();
    expect(createSessionSchema.parse(request)).toEqual(request);
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
