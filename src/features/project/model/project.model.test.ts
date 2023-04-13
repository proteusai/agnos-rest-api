import mongoose from "mongoose";
import { connect, disconnect } from "@utils/connect";
import ProjectModel, { ProjectInput } from "@models/project";

describe("Project model", () => {
  const projectInput: ProjectInput = {
    name: "Test Project",
    org: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
  };
  const project = new ProjectModel({ ...projectInput });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await ProjectModel.collection.drop();
    await disconnect();
  });

  it("should create a project", async () => {
    const createdProject = await project.save();
    expect(createdProject).toBeDefined();
    expect(createdProject.name).toBe(project.name);
    expect(createdProject.org).toBe(project.org);
    expect(createdProject.user).toBe(project.user);
    expect(createdProject._id).toBeDefined();
    expect(createdProject.createdAt).toBeDefined();
    expect(createdProject.updatedAt).toBeDefined();
  });

  it("should find a project", async () => {
    const foundProject = await ProjectModel.findOne({ _id: project._id });
    expect(foundProject).toBeDefined();
    expect(foundProject).toMatchObject(projectInput);
  });

  it("should update a project", async () => {
    const projectUpdateInput: ProjectInput = {
      name: "Updated Name",
      description: "updated description",
      org: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };
    await ProjectModel.updateOne({ _id: project._id }, { ...projectUpdateInput });
    const foundOrg = await ProjectModel.findOne({ _id: project._id });
    expect(foundOrg).toBeDefined();
    expect(foundOrg).toMatchObject(projectUpdateInput);
    expect(foundOrg).not.toMatchObject(projectInput);
  });

  it("should delete a project", async () => {
    await ProjectModel.deleteOne({ _id: project._id });
    const foundOrg = await ProjectModel.findOne({ _id: project._id });
    expect(foundOrg).toBeNull();
  });
});
