import {
  DEFAULT_QUERY_LIMIT,
  DEFAULT_QUERY_MAX_LIMIT,
  DEFAULT_QUERY_MAX_SKIP,
  DEFAULT_QUERY_MIN_LIMIT,
  DEFAULT_QUERY_MIN_SKIP,
  DEFAULT_QUERY_SKIP,
} from "@constants/defaults";
import { Request, Response, NextFunction } from "express";

const queryParser = (req: Request, res: Response, next: NextFunction) => {
  // example: ?@limit=20
  let limit = req.query && req.query["@size"] ? parseInt(req.query["@size"] as string) : DEFAULT_QUERY_LIMIT;
  limit = Math.min(DEFAULT_QUERY_MAX_LIMIT, Math.max(DEFAULT_QUERY_MIN_LIMIT, limit));

  // example: ?@page=1
  let skip =
    req.query && req.query["@page"] ? (parseInt(req.query["@page"] as string) - 1) * limit : DEFAULT_QUERY_SKIP;
  skip = Math.min(DEFAULT_QUERY_MAX_SKIP, Math.max(DEFAULT_QUERY_MIN_SKIP, skip));

  // example: ?@sort=createdAt:desc;updatedAt:asc
  // task: convert "createdAt:desc;updatedAt:asc" to { createdAt: "desc", updatedAt: "asc" }
  const sort =
    req.query && req.query["@sort"]
      ? (req.query["@sort"] as string).split(";").reduce((acc, cur) => {
          if (!cur) {
            return acc;
          }
          const [key, value] = cur.split(":");
          return {
            ...acc,
            [key]: value || "asc",
          };
        }, {})
      : {};

  // example: ?@include=author:name;comments:author,likes,shares;
  // task: convert "author:name;comments:author,likes,shares;" to [{ path: "author", select: "name" }, { path: "comments", select: "author likes shares" }]
  const populate =
    req.query && req.query["@include"]
      ? (req.query["@include"] as string).split(";").reduce((acc: Array<{ path: string; select?: string }>, cur) => {
          if (!cur) {
            return acc;
          }
          const [path, select] = cur.split(":");
          return [
            ...acc,
            {
              path,
              select: select ? select.split(",").join(" ") : undefined,
            },
          ];
        }, [])
      : [];

  // example: ?age=10&name:ne=John&country:in=US,UK
  // task: convert "age=10&name:ne=John&country:in=US,UK" to { age: 10, name: { $ne: "John" }, country: { $in: ["US", "UK"] } }
  // for operators:
  // comparison (the only set of operators fully supported): https://www.mongodb.com/docs/manual/reference/operator/query-comparison/
  const filter = Object.keys(req.query || {}).reduce((acc, key) => {
    if (key.startsWith("@")) {
      return acc;
    }
    const value = req.query[key] as string;
    if (key.includes(":")) {
      const [realKey, operator] = key.split(":");
      return {
        ...acc,
        [realKey]:
          operator === "in" || operator === "nin"
            ? { [`$${operator}`]: value.split(",") }
            : { [`$${operator}`]: value },
      };
    } else {
      return {
        ...acc,
        [key]: value,
      };
    }
  }, {});

  // TODO: select ??

  res.locals.query = {
    ...(res.locals.query || {}),
    limit,
    skip,
    sort,
    populate,
    filter,
  };

  return next();
};

export default queryParser;
