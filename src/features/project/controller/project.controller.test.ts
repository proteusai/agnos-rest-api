import { Request, Response } from "express";
import { createProjectHandler, getProjectHandler, getProjectsHandler } from "@controllers/project";
import { createProjectDocument, findProject, findProjects } from "@services/project";
import { CreateProjectRequest, GetProjectRequest } from "@schemas/project";
import { findUserDocument } from "@services/user";
import mongoose from "mongoose";
import { Obj } from "@types";
import { mockMongooseDocument } from "@mocks/mongoose";
import { findOrgDocument } from "@services/org";
import { ORG_NOT_FOUND, PROJECT_NOT_FOUND } from "@constants/errors";
import { createCollaboration } from "@services/collaboration";
import { PermissionName } from "@constants/permissions";

jest.mock("@services/user");
jest.mock("@services/org");
jest.mock("@services/project");
jest.mock("@services/collaboration");

const mockedFindUser = findUserDocument as jest.MockedFunction<typeof findUserDocument>;
const mockedFindOrgDocument = findOrgDocument as jest.MockedFunction<typeof findOrgDocument>;
const mockedFindProject = findProject as jest.MockedFunction<typeof findProject>;
const mockedFindProjects = findProjects as jest.MockedFunction<typeof findProjects>;
const mockedCreateProjectDocument = createProjectDocument as jest.MockedFunction<typeof createProjectDocument>;
const mockedCreateCollaboration = createCollaboration as jest.MockedFunction<typeof createCollaboration>;

const orgId = new mongoose.Types.ObjectId();
const projectId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

const mockedOrgDoc = {
  _id: orgId,
  name: "Test Org",
  description: "A test org",
  user: userId,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...mockMongooseDocument,
};

const mockedProject = {
  _id: projectId,
  name: "Test Project",
  description: "A test project",
  org: orgId,
  user: userId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockedProjectDoc = {
  ...mockedProject,
  ...mockMongooseDocument,
};

describe("Project controller", () => {
  let res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
    locals: { user: { _id: userId }, query: { filter: {}, limit: 100, skip: 0 } },
  } as unknown as Response;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      locals: { user: { _id: userId }, query: { filter: {}, limit: 100, skip: 0 } },
    } as unknown as Response;
  });

  describe("createProjectHandler", () => {
    test("should return an error response if the org specified does not exist", async () => {
      const req = {
        body: { name: "Test Project", description: "A test project" },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<Obj, Obj, CreateProjectRequest["body"]>;
      mockedFindOrgDocument.mockResolvedValueOnce(null);

      await createProjectHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledWith({ _id: userId });
      expect(mockedFindOrgDocument).toHaveBeenCalledWith({ user: userId, personal: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: { name: "Error", message: ORG_NOT_FOUND } });
    });

    test("should create a personal project if org is not specified", async () => {
      const req = {
        body: { name: "Test Project", description: "A test project" },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<Obj, Obj, CreateProjectRequest["body"]>;
      mockedFindOrgDocument.mockResolvedValueOnce({ ...mockedOrgDoc, personal: true });
      mockedCreateProjectDocument.mockResolvedValueOnce(mockedProjectDoc);
      mockedFindProject.mockResolvedValueOnce(mockedProject);

      await createProjectHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledWith({ _id: userId });
      expect(mockedFindOrgDocument).toHaveBeenCalledWith({ user: userId, personal: true });
      expect(mockedCreateProjectDocument).toHaveBeenCalledWith({
        ...req.body,
        user: userId,
        org: mockedOrgDoc._id,
        personal: true,
      });
      expect(mockedCreateCollaboration).toHaveBeenCalledWith({
        org: mockedOrgDoc._id,
        permission: PermissionName.ADMIN,
        user: userId,
        project: mockedProjectDoc._id,
      });
      expect(mockedFindProject).toHaveBeenCalledWith({ _id: mockedProjectDoc._id });
      expect(res.send).toHaveBeenCalledWith({ data: mockedProject });
    });

    test("should create a non-personal project if org is specified", async () => {
      const req = {
        body: { name: "Test Project", description: "A test project", org: orgId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<Obj, Obj, CreateProjectRequest["body"]>;
      mockedFindOrgDocument.mockResolvedValueOnce({ ...mockedOrgDoc, personal: false });
      mockedCreateProjectDocument.mockResolvedValueOnce(mockedProjectDoc);
      mockedFindProject.mockResolvedValueOnce(mockedProject);

      await createProjectHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledWith({ _id: userId });
      expect(mockedFindOrgDocument).toHaveBeenCalledWith({ _id: req.body.org });
      expect(mockedCreateProjectDocument).toHaveBeenCalledWith({
        ...req.body,
        user: userId,
        org: mockedOrgDoc._id,
        personal: false,
      });
      expect(mockedCreateCollaboration).toHaveBeenCalledWith({
        org: mockedOrgDoc._id,
        permission: PermissionName.ADMIN,
        user: userId,
        project: mockedProjectDoc._id,
      });
      expect(mockedFindProject).toHaveBeenCalledWith({ _id: mockedProjectDoc._id });
      expect(res.send).toHaveBeenCalledWith({ data: mockedProject });
    });
  });

  describe("getProjectHandler", () => {
    test("returns an error response if a project with the specified id cannot be found", async () => {
      const req = {
        params: { id: projectId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<GetProjectRequest["params"]>;
      mockedFindProject.mockResolvedValueOnce(null);

      await getProjectHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: { name: "Error", message: PROJECT_NOT_FOUND } });
    });

    test("returns a project with the specified id", async () => {
      const req = {
        params: { id: projectId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<GetProjectRequest["params"]>;
      mockedFindProject.mockResolvedValueOnce(mockedProject);

      await getProjectHandler(req, res);

      expect(res.send).toHaveBeenCalledWith({ data: mockedProject });
    });
  });

  describe("getProjectsHandler", () => {
    test("returns an array of projects", async () => {
      const req = {
        query: { id: projectId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request;
      mockedFindProjects.mockResolvedValueOnce([mockedProject]);

      await getProjectsHandler(req, res);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ data: [mockedProject] }));
    });
  });
});
