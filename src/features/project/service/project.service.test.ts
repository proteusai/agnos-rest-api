import { FilterQuery } from "mongoose";
import ProjectModel, { ProjectDocument, ProjectInput } from "@models/project";
import { connect, disconnect } from "@utils/connect";
import { createProject, findProject, findProjects } from "@services/project";
import { MOCK_SERVICE_OPTIONS } from "@/mocks";

describe("Project service", () => {
  const input: ProjectInput = {
    name: "Test Project",
    org: "5f9f1c5b9b9b9b9b9b9b9b9a",
    user: "5f9f1c5b9b9b9b9b9b9b9b9b",
  };

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await ProjectModel.collection.drop();
    await disconnect();
  });

  describe("createProject", () => {
    it("should create a project", async () => {
      const project = await createProject(input);
      expect(project).toBeDefined();
      expect(project._id).toBeDefined();
      expect(String(project.user)).toBe(String(input.user));
      expect(String(project.org)).toBe(String(input.org));
      // should have a default "personal" and "private" values of false
      expect(String(project.personal)).toBe(String(false));
      expect(String(project.private)).toBe(String(false));
    });
  });

  describe("findProject", () => {
    it("should find a project by query", async () => {
      const project = await createProject(input);
      const query: FilterQuery<ProjectDocument> = {
        _id: project._id,
      };
      const foundProject = await findProject(query);
      expect(foundProject).toBeDefined();
      expect(String(foundProject?.user)).toBe(String(project.user));
      expect(String(project.org)).toBe(String(input.org));
    });
  });

  describe("findProjects", () => {
    it("should find projects by query", async () => {
      const query: FilterQuery<ProjectDocument> = {
        user: input.user,
      };
      const projects = await findProjects(query, MOCK_SERVICE_OPTIONS);
      expect(projects).toBeDefined();
      // we have some projects in the database from the tests above
      expect(projects.length).toBeGreaterThan(0);
    });
  });
});
