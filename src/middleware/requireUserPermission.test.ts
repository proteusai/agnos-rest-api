import { Request, Response } from "express";
import requireUserPermission from "./requireUserPermission";
import { PermissionName } from "@constants/permissions";
import { ACCESS_FORBIDDEN } from "@constants/errors";
import { findCollaboration } from "@services/collaboration";
import { findMemberships } from "@services/membership";
import mongoose from "mongoose";

jest.mock("@services/membership");
jest.mock("@services/collaboration");
const mockedFindMemberships = findMemberships as jest.MockedFunction<typeof findMemberships>;
const mockedFindCollaboration = findCollaboration as jest.MockedFunction<typeof findCollaboration>;

const projectId = new mongoose.Types.ObjectId();
const mockRequest = {
  params: { project: projectId },
} as unknown as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  locals: { user: { _id: new mongoose.Types.ObjectId() } },
} as unknown as Response;

const mockNextFunction = jest.fn();

describe("requireUserPermission middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if user has permission on the resource collaboration", async () => {
    // the user is added directly to the project
    mockedFindCollaboration.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      project: projectId,
      permission: PermissionName.admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await requireUserPermission(PermissionName.admin, "project", "params.project")(
      mockRequest,
      mockResponse,
      mockNextFunction
    );

    expect(mockedFindCollaboration).toHaveBeenCalledWith({
      user: mockResponse.locals.user?._id,
      project: projectId,
      team: { $eq: null },
      permission: { $ne: null },
    });
    // since the user is added directly to the project, we don't need to check for the user's team memberships
    expect(mockedFindMemberships).not.toHaveBeenCalled();
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("should call next if user has permission on the team collaboration", async () => {
    const teamId = new mongoose.Types.ObjectId();

    // the user is NOT added directly to the project but belongs to a team that has access to the project
    mockedFindCollaboration.mockResolvedValueOnce(null);

    mockedFindMemberships.mockResolvedValueOnce([
      {
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        org: new mongoose.Types.ObjectId(),
        team: teamId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockedFindCollaboration.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      team: teamId,
      project: projectId,
      permission: PermissionName.admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await requireUserPermission(PermissionName.admin, "project", "params.project")(
      mockRequest,
      mockResponse,
      mockNextFunction
    );

    expect(mockedFindCollaboration).toHaveBeenCalledWith({
      user: mockResponse.locals.user?._id,
      project: projectId,
      team: { $eq: null },
      permission: { $ne: null },
    });
    expect(mockedFindMemberships).toHaveBeenCalledWith({
      user: mockResponse.locals.user?._id,
      team: { $ne: null },
    });
    expect(mockedFindCollaboration).toHaveBeenCalledWith({
      user: { $eq: null },
      project: projectId,
      team: teamId,
      permission: { $ne: null },
    });
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("should throw an error if the user does not have the required permission", async () => {
    mockedFindCollaboration.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      project: projectId,
      permission: PermissionName.write,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockedFindMemberships.mockResolvedValueOnce([]);

    await requireUserPermission(PermissionName.admin, "project", "params.project")(
      mockRequest,
      mockResponse,
      mockNextFunction
    );

    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: ACCESS_FORBIDDEN,
      },
    });
  });

  it("should throw an error if the user belongs to a team that does not have the required permission", async () => {
    const teamId = new mongoose.Types.ObjectId();

    // the user is NOT added directly to the project but belongs to a team that has access to the project
    mockedFindCollaboration.mockResolvedValueOnce(null);

    mockedFindMemberships.mockResolvedValueOnce([
      {
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        org: new mongoose.Types.ObjectId(),
        team: teamId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockedFindCollaboration.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      team: teamId,
      project: projectId,
      permission: PermissionName.write,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await requireUserPermission(PermissionName.admin, "project", "params.project")(
      mockRequest,
      mockResponse,
      mockNextFunction
    );

    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: ACCESS_FORBIDDEN,
      },
    });
  });

  it("should throw an error if the user is not a collaborator on the resource", async () => {
    mockedFindCollaboration.mockResolvedValueOnce(null);
    mockedFindMemberships.mockResolvedValueOnce([]);

    await requireUserPermission(PermissionName.admin, "project", "params.project")(
      mockRequest,
      mockResponse,
      mockNextFunction
    );

    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: ACCESS_FORBIDDEN,
      },
    });
  });
});
