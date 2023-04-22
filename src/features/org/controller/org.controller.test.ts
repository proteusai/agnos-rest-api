import { Request, Response } from "express";
import { createOrgHandler, getOrgHandler, getOrgsHandler } from "@controllers/org";
import { createOrgDocument, findOrg, findOrgs } from "@services/org";
import { CreateOrgRequest, GetOrgRequest } from "@schemas/org";
import { findUserDocument } from "@services/user";
import mongoose from "mongoose";
import { Obj } from "@types";
import { mockMongooseDocument } from "@mocks/mongoose";
import { ORG_NOT_FOUND } from "@constants/errors";
import { createMembership } from "../../../service/membership.service";
import { RoleName } from "@constants/permissions";

jest.mock("@services/user");
jest.mock("@services/org");
jest.mock("../../../service/membership.service");

const mockedFindUser = findUserDocument as jest.MockedFunction<typeof findUserDocument>;
const mockedFindOrg = findOrg as jest.MockedFunction<typeof findOrg>;
const mockedFindOrgs = findOrgs as jest.MockedFunction<typeof findOrgs>;
const mockedCreateOrgDocument = createOrgDocument as jest.MockedFunction<typeof createOrgDocument>;
const mockedCreateMembership = createMembership as jest.MockedFunction<typeof createMembership>;

const orgId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

const mockedOrg = {
  _id: orgId,
  name: "Test Org",
  description: "A test org",
  user: userId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockedOrgDoc = {
  ...mockedOrg,
  ...mockMongooseDocument,
};

describe("Organization controller", () => {
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

  describe("createOrgHandler", () => {
    test("should create an org", async () => {
      const req = {
        body: { name: "Test Org", description: "A test org" },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<Obj, Obj, CreateOrgRequest["body"]>;
      mockedCreateOrgDocument.mockResolvedValueOnce(mockedOrgDoc);
      mockedFindOrg.mockResolvedValueOnce(mockedOrg);

      await createOrgHandler(req, res);

      expect(mockedFindUser).toHaveBeenCalledWith({ _id: userId });
      expect(mockedCreateOrgDocument).toHaveBeenCalledWith({ ...req.body, user: userId });
      expect(mockedCreateMembership).toHaveBeenCalledWith({
        org: mockedOrgDoc._id,
        user: userId,
        role: RoleName.OWNER,
      });
      expect(mockedFindOrg).toHaveBeenCalledWith({ _id: mockedOrgDoc._id });
      expect(res.send).toHaveBeenCalledWith({ data: mockedOrg });
    });
  });

  describe("getOrgHandler", () => {
    test("returns an error response if an org with the specified id cannot be found", async () => {
      const req = {
        params: { id: orgId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<GetOrgRequest["params"]>;
      mockedFindOrg.mockResolvedValueOnce(null);

      await getOrgHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: { name: "Error", message: ORG_NOT_FOUND } });
    });

    test("returns an org with the specified id", async () => {
      const req = {
        params: { id: orgId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request<GetOrgRequest["params"]>;
      mockedFindOrg.mockResolvedValueOnce(mockedOrg);

      await getOrgHandler(req, res);

      expect(res.send).toHaveBeenCalledWith({ data: mockedOrg });
    });
  });

  describe("getOrgsHandler", () => {
    test("returns an array of orgs", async () => {
      const req = {
        query: { id: orgId },
        get: jest.fn().mockReturnValue(""),
      } as unknown as Request;
      mockedFindOrgs.mockResolvedValueOnce([mockedOrg]);

      await getOrgsHandler(req, res);

      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ data: [mockedOrg] }));
    });
  });
});
