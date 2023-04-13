import {
  CreateProjectRequest,
  GetProjectRequest,
  createProjectRequestSchema,
  getProjectRequestSchema,
} from "@schemas/project";

describe("Project schema", () => {
  describe("Create Project schema", () => {
    it("should validate well-formed objects", async () => {
      const request: CreateProjectRequest = {
        body: {
          name: "Test Project",
        },
      };
      expect(() => {
        createProjectRequestSchema.parse(request);
      }).not.toThrowError();
      expect(createProjectRequestSchema.parse(request)).toEqual(request);
    });

    it("should not validate malformed objects", async () => {
      // no name
      expect(() => {
        createProjectRequestSchema.parse({
          body: {
            description: "test description",
          },
        });
      }).toThrowError();
    });
  });

  describe("Get project schema", () => {
    it("should validate well-formed objects", async () => {
      const request: GetProjectRequest = {
        params: {
          id: "12234459847373782",
        },
        query: {},
      };
      expect(() => {
        getProjectRequestSchema.parse(request);
      }).not.toThrowError();
      expect(getProjectRequestSchema.parse(request)).toEqual(request);
    });
  });
});
