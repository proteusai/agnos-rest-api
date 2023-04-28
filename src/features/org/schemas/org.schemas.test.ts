import { CreateOrgRequest, GetOrgRequest, createOrgRequestSchema, getOrgRequestSchema } from "@schemas/org";

describe("Org schema", () => {
  describe("Create org schema", () => {
    it("should validate well-formed objects", async () => {
      const request: CreateOrgRequest = {
        body: {
          name: "Test Org",
          email: "example@email.com",
        },
      };
      expect(() => {
        createOrgRequestSchema.parse(request);
      }).not.toThrowError();
      expect(createOrgRequestSchema.parse(request)).toEqual(request);
    });

    it("should not validate malformed objects", async () => {
      // no name
      expect(() => {
        createOrgRequestSchema.parse({
          body: {
            email: "example@email.com",
          },
        });
      }).toThrowError();

      // invalid email
      expect(() => {
        createOrgRequestSchema.parse({
          body: {
            name: "Test Org",
            email: "email",
          },
        });
      }).toThrowError();
    });
  });

  describe("Get org schema", () => {
    it("should validate well-formed objects", async () => {
      const request: GetOrgRequest = {
        params: {
          org: "12234459847373782",
        },
      };
      expect(() => {
        getOrgRequestSchema.parse(request);
      }).not.toThrowError();
      expect(getOrgRequestSchema.parse(request)).toEqual(request);
    });
  });
});
