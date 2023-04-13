import mongoose from "mongoose";
import { connect, disconnect } from "@utils/connect";
import OrgModel, { OrgInput } from "@models/org";

describe("Org model", () => {
  const orgInput: OrgInput = {
    name: "Test Org",
    user: new mongoose.Types.ObjectId(),
  };
  const org = new OrgModel({ ...orgInput });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await OrgModel.collection.drop();
    await disconnect();
  });

  it("should create an organization", async () => {
    const createdOrg = await org.save();
    expect(createdOrg).toBeDefined();
    expect(createdOrg.name).toBe(org.name);
    expect(createdOrg.user).toBe(org.user);
    expect(createdOrg._id).toBeDefined();
    expect(createdOrg.createdAt).toBeDefined();
    expect(createdOrg.updatedAt).toBeDefined();
  });

  it("should find an organization", async () => {
    const foundOrg = await OrgModel.findOne({ _id: org._id });
    expect(foundOrg).toBeDefined();
    expect(foundOrg).toMatchObject(orgInput);
  });

  it("should update an organization", async () => {
    const orgUpdateInput: OrgInput = {
      name: "Updated Name",
      email: "updated-example@email.com",
      user: new mongoose.Types.ObjectId(),
    };
    await OrgModel.updateOne({ _id: org._id }, { ...orgUpdateInput });
    const foundOrg = await OrgModel.findOne({ _id: org._id });
    expect(foundOrg).toBeDefined();
    expect(foundOrg).toMatchObject(orgUpdateInput);
    expect(foundOrg).not.toMatchObject(orgInput);
  });

  it("should delete an organization", async () => {
    await OrgModel.deleteOne({ _id: org._id });
    const foundOrg = await OrgModel.findOne({ _id: org._id });
    expect(foundOrg).toBeNull();
  });
});
