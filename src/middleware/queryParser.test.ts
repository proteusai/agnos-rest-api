import { NextFunction, Request, Response } from "express";
import queryParser from "@middleware/queryParser";

describe("queryParser middleware", () => {
  let res = { locals: {} } as unknown as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    res = { locals: {} } as unknown as Response;
  });

  it("returns default query values for requests without query params", async () => {
    const req = {} as unknown as Request;

    queryParser(req, res, next);

    expect(res.locals).toHaveProperty("query");
    expect(res.locals.query).toMatchObject({ filter: {}, limit: 20, populate: [], skip: 0, sort: {} });
  });

  it("returns default query values for requests with empty query params", async () => {
    const req = {
      query: {},
    } as unknown as Request;

    queryParser(req, res, next);

    expect(res.locals).toHaveProperty("query");
    expect(res.locals.query).toMatchObject({ filter: {}, limit: 20, populate: [], skip: 0, sort: {} });
  });

  describe("@size", () => {
    it("returns limit of 1 if @size is less than 1", async () => {
      const req = {
        query: { "@size": "0" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("limit", 1);
    });

    it("returns limit of 100 if @size is greater than 100", async () => {
      const req = {
        query: { "@size": "200" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("limit", 100);
    });

    it("returns limit of specified value", async () => {
      const req = {
        query: { "@size": "50" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("limit", 50);
    });

    it("returns default limit if @size is not specified", async () => {
      const req = {
        query: {},
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("limit", 20);
    });
  });

  describe("@page", () => {
    it("returns skip of 0 if @page is less than 1", async () => {
      const req = {
        query: { "@page": "-1" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("skip", 0);
    });

    it("returns skip of appropriate value", async () => {
      const req = {
        query: { "@page": "3", "@size": "50" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("skip", 100);
    });

    it("returns default skip if @page is not specified", async () => {
      const req = {
        query: {},
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("skip", 0);
    });
  });

  describe("@sort", () => {
    it("returns appropriate value for sort", async () => {
      const req = {
        query: { "@sort": "createdAt:asc;updatedAt:desc;deletedAt" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("sort");
      expect(res.locals.query.sort).toMatchObject({ createdAt: "asc", updatedAt: "desc", deletedAt: "asc" });
    });
  });

  describe("@include", () => {
    it("returns appropriate value for populate", async () => {
      const req = {
        query: { "@include": "author:name;comments:author,likes,shares;" },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("populate");
      expect(res.locals.query.populate).toMatchObject([
        { path: "author", select: "name" },
        { path: "comments", select: "author likes shares" },
      ]);
    });
  });

  describe("filter", () => {
    it("returns appropriate value for filter", async () => {
      const req = {
        query: {
          "@include": "author:name;comments:author,likes,shares;",
          "@page": "3",
          "@size": "50",
          "@sort": "createdAt:asc;updatedAt:desc;deletedAt",
          age: "10",
          "name:ne": "John",
          "country:in": "UK,USA",
        },
      } as unknown as Request;

      queryParser(req, res, next);

      expect(res.locals).toHaveProperty("query");
      expect(res.locals.query).toHaveProperty("filter");
      expect(res.locals.query.filter).toMatchObject({
        age: "10",
        name: { $ne: "John" },
        country: { $in: ["UK", "USA"] },
      });
    });
  });
});
