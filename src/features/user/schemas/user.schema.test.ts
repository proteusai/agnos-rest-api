import { CreateUserRequest, createUserRequestSchema } from "@schemas/user";

describe("Create user schema", () => {
  it("should validate well-formed objects", async () => {
    const request: CreateUserRequest = {
      body: {
        name: "Jane Doe",
        email: "example@email.com",
      },
    };
    expect(() => {
      createUserRequestSchema.parse(request);
    }).not.toThrowError();
    expect(createUserRequestSchema.parse(request)).toEqual(request);
  });

  it("should not validate malformed objects", async () => {
    // no email
    expect(() => {
      createUserRequestSchema.parse({
        body: {
          name: "Jane Doe",
        },
      });
    }).toThrowError();

    // no name
    expect(() => {
      createUserRequestSchema.parse({
        body: {
          email: "example@email.com",
        },
      });
    }).toThrowError();

    // invalid email
    expect(() => {
      createUserRequestSchema.parse({
        body: {
          name: "Jane Doe",
          email: "email",
        },
      });
    }).toThrowError();
  });

  it("should not validate passwords that are too short", async () => {
    expect(() => {
      createUserRequestSchema.parse({
        body: {
          name: "Jane Doe",
          email: "example@email.com",
          password: "123",
          passwordConfirmation: "123",
        },
      });
    }).toThrowError();
  });

  it("should not validate passwords that don't match", async () => {
    expect(() => {
      createUserRequestSchema.parse({
        body: {
          name: "Jane Doe",
          email: "example@email.com",
          password: "123456",
          passwordConfirmation: "1234567",
        },
      });
    }).toThrowError();
  });
});
