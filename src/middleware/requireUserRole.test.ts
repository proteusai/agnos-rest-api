import { Request, Response } from "express";
import requireUserRole from "./requireUserRole";
import { findMembership } from "@/service/membership.service";
import { RoleName } from "@/constants/permissions";
import mongoose from "mongoose";
import { ACCESS_FORBIDDEN } from "@constants/errors";

jest.mock("@/service/membership.service");
const mockedFindMembership = findMembership as jest.MockedFunction<typeof findMembership>;

const mockRequest = {
  params: { id: "123" },
} as unknown as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  locals: { user: { _id: new mongoose.Types.ObjectId() } },
} as unknown as Response;

const mockNextFunction = jest.fn();

describe("requireUserRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() when the user has the required role", async () => {
    mockedFindMembership.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      role: RoleName.owner,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await requireUserRole(RoleName.owner, "params.id")(mockRequest, mockResponse, mockNextFunction);

    expect(mockedFindMembership).toHaveBeenCalledWith({
      user: mockResponse.locals.user?._id,
      org: mockRequest["params"]["id"],
      team: { $eq: null },
      role: { $ne: null },
    });
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("should throw an error when the user does not have the required role", async () => {
    mockedFindMembership.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      org: new mongoose.Types.ObjectId(),
      role: RoleName.member,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await requireUserRole(RoleName.owner, "params.id")(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: ACCESS_FORBIDDEN,
      },
    });
  });

  it("should throw an error when the user is not a member of the org", async () => {
    mockedFindMembership.mockResolvedValueOnce(null);

    await requireUserRole(RoleName.owner, "params.id")(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: ACCESS_FORBIDDEN,
      },
    });
  });

  it("should catch and handle errors thrown by findMembership", async () => {
    mockedFindMembership.mockRejectedValueOnce(new Error("Test error"));

    await requireUserRole(RoleName.owner, "params.id")(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        name: "Error",
        message: "Test error",
      },
    });
  });
});
