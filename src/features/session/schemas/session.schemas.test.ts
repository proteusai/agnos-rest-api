import { CreateSessionRequest, createSessionRequestSchema } from "@schemas/session";

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
      createSessionRequestSchema.parse(request);
    }).not.toThrowError();
    expect(createSessionRequestSchema.parse(request)).toEqual(request);
  });

  it("should not validate malformed objects", async () => {
    // no email
    expect(() => {
      createSessionRequestSchema.parse({
        body: {
          accessToken: "accessToken",
          idToken: "idToken",
        },
      });
    }).toThrowError();

    // no access token
    expect(() => {
      createSessionRequestSchema.parse({
        body: {
          email: "example@email.com",
          idToken: "idToken",
        },
      });
    }).toThrowError();

    // no ID token
    expect(() => {
      createSessionRequestSchema.parse({
        body: {
          email: "example@email.com",
          accessToken: "accessToken",
        },
      });
    }).toThrowError();

    // invalid email
    expect(() => {
      createSessionRequestSchema.parse({
        body: {
          email: "email",
          accessToken: "accessToken",
          idToken: "idToken",
        },
      });
    }).toThrowError();
  });
});
