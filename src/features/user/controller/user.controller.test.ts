import { Request, Response } from "express";
import { createUserHandler, getMeHandler } from "./user.controller";
import * as userService from "@services/user";
import * as orgService from "@services/org";
import * as membershipService from "../../../service/membership.service";
import * as settingsService from "@services/settings";
import { RoleName } from "@constants/permissions";
import { DEFAULT_ORG_NAME, DEFAULT_ORG_PICTURE } from "@constants/defaults";
import mongoose from "mongoose";
import UserModel from "../model/user.model";

jest.mock("@services/user");
jest.mock("@services/org");
jest.mock("../../../service/membership.service");
jest.mock("@services/settings");

describe("User Controller", () => {
  describe("createUserHandler", () => {
    it("should create a new user and return it", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
        },
      } as unknown as Request;
      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      const mockMongooseDocumentPrototype = new UserModel();
      const mockMongooseDocument = {
        $assertPopulated: jest.fn(),
        $clone: jest.fn(),
        $getAllSubdocs: jest.fn(),
        $ignore: jest.fn(),
        $isDefault: jest.fn(),
        $isDeleted: jest.fn().mockReturnValue(false),
        $getPopulatedDocs: jest.fn(),
        $inc: jest.fn(),
        $isEmpty: jest.fn().mockReturnValue(true),
        $isValid: jest.fn().mockReturnValue(true),
        $locals: { data: "some data" },
        $markValid: jest.fn(),
        $model: jest.fn(),
        $op: null,
        $session: jest.fn(),
        $set: jest.fn(),
        $where: {},
        collection: mockMongooseDocumentPrototype.collection,
        db: mockMongooseDocumentPrototype.db,
        delete: jest.fn(),
        deleteOne: jest.fn(),
        depopulate: jest.fn(),
        directModifiedPaths: jest.fn(),
        equals: jest.fn(),
        get: jest.fn(),
        getChanges: jest.fn().mockReturnValue({}),
        increment: jest.fn(),
        init: jest.fn(),
        invalidate: jest.fn(),
        isDirectModified: jest.fn(),
        isDirectSelected: jest.fn(),
        isInit: jest.fn(),
        isModified: jest.fn(),
        isNew: true,
        isSelected: jest.fn(),
        markModified: jest.fn(),
        modifiedPaths: jest.fn(),
        overwrite: jest.fn(),
        $parent: jest.fn(),
        populate: jest.fn(),
        populated: jest.fn(),
        remove: jest.fn(),
        replaceOne: jest.fn(),
        save: jest.fn(),
        schema: mockMongooseDocumentPrototype.schema,
        set: jest.fn(),
        toJSON: jest.fn(),
        toObject: jest.fn(),
        unmarkModified: jest.fn(),
        update: jest.fn(),
        updateOne: jest.fn(),
        validate: jest.fn(),
        validateSync: jest.fn(),
      };
      jest.spyOn(userService, "createUserDocument").mockImplementation(() => {
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId(),
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
          comparePassword: jest.fn(),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...mockMongooseDocument,
        });
      });
      jest.spyOn(orgService, "createOrgDocument").mockImplementation(() => {
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId(),
          name: DEFAULT_ORG_NAME,
          email: "john.doe@example.com",
          personal: true,
          description: "This is my own space and I can invite people in.",
          private: true,
          picture: DEFAULT_ORG_PICTURE,
          user: new mongoose.Types.ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...mockMongooseDocument,
        });
      });
      jest.spyOn(membershipService, "createMembership").mockImplementation(() => {
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId(),
          user: new mongoose.Types.ObjectId(),
          org: new mongoose.Types.ObjectId(),
          role: RoleName.OWNER,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      jest.spyOn(settingsService, "createSettings").mockImplementation(() => {
        return Promise.resolve({
          _id: new mongoose.Types.ObjectId(),
          user: new mongoose.Types.ObjectId(),
          autoSave: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      await createUserHandler(req, res);
      expect(res.send).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(409);
    });

    it("should return a 409 error if there is an error creating the user", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
        },
      } as unknown as Request;
      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;
      // Mock the createUserDocument function to throw an error
      jest.spyOn(userService, "createUserDocument").mockImplementation(() => {
        throw new Error("Error creating user");
      });
      await createUserHandler(req, res);
      expect(res.send).toHaveBeenCalledWith({ error: { name: "Error", message: "Error creating user" } });
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe("getMeHandler", () => {
    it("should return the current user", async () => {
      const req = {} as unknown as Request;
      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        locals: {
          user: {
            _id: "abc123",
          },
        },
      } as unknown as Response;
      // Mock the findUser function to return a user
      jest.spyOn(userService, "findUser").mockImplementation(() => {
        return Promise.resolve({
          _id: "abc123",
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
          comparePassword: jest.fn(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      await getMeHandler(req, res);
      expect(res.send).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return a 404 error if the user is not found", async () => {
      const req = {} as unknown as Request;
      const res = {
        send: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        locals: {
          user: {
            _id: "abc123",
          },
        },
      } as unknown as Response;
      // Mock the findUser function to return null
      jest.spyOn(userService, "findUser").mockImplementation(() => {
        return Promise.resolve(null);
      });
      await getMeHandler(req, res);
      expect(res.send).toHaveBeenCalledWith({ error: { name: "Error", message: "User not found" } });
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
