import { FilterQuery } from "mongoose";
import OrgModel, { OrgDocument, OrgInput } from "@models/org";
import { connect, disconnect } from "@utils/connect";
import { createOrg, findOrg, findOrgs } from "@services/org";
import { MOCK_SERVICE_OPTIONS } from "@/mocks";

describe("Org service", () => {
  const input: OrgInput = {
    name: "Test Project",
    user: "5f9f1c5b9b9b9b9b9b9b9b9b",
  };

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await OrgModel.collection.drop();
    await disconnect();
  });

  describe("createOrg", () => {
    it("should create an org", async () => {
      const org = await createOrg(input);
      expect(org).toBeDefined();
      expect(org._id).toBeDefined();
      expect(String(org.user)).toBe(String(input.user));
      // should have a default "personal" and "private" values of false
      expect(String(org.personal)).toBe(String(false));
      expect(String(org.private)).toBe(String(false));
    });
  });

  describe("findOrg", () => {
    it("should find an org by query", async () => {
      const org = await createOrg(input);
      const query: FilterQuery<OrgDocument> = {
        _id: org._id,
      };
      const foundOrg = await findOrg(query);
      expect(foundOrg).toBeDefined();
      expect(String(foundOrg?.name)).toBe(String(org.name));
      expect(String(foundOrg?.user)).toBe(String(org.user));
    });
  });

  describe("findOrgs", () => {
    it("should find orgs by query", async () => {
      const query: FilterQuery<OrgDocument> = {
        user: input.user,
      };
      const orgs = await findOrgs(query, MOCK_SERVICE_OPTIONS);
      expect(orgs).toBeDefined();
      // we have some orgs in the database from the tests above
      expect(orgs.length).toBeGreaterThan(0);
    });
  });
});
