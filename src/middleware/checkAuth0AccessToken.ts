/**
 * Not working
 * Will revisit
 * https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens?_ga=2.104554946.334189265.1649291171-2107862163.1649291171&_gl=1*16yx18b*rollup_ga*MTU4MTg4MTk3NC4xNjQ5MDI1MDUz*rollup_ga_F1G3E656YZ*MTY0OTQxNDI3MS4xOC4xLjE2NDk0MTU2MzAuMzY.
 */

// // import { auth } from "express-oauth2-jwt-bearer";
// import jwt from "express-jwt";
// import jwks from "jwks-rsa";
// import config from "config";

// const checkAuth0AccessToken = auth({
//   audience: config.get("auth0Audience"),
//   issuerBaseURL: config.get("auth0IssuerBaseUrl"),
// });

// const checkAuth0AccessToken = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `${config.get("auth0IssuerBaseUrl")}.well-known/jwks.json`,
//   }),
//   audience: config.get("auth0Audience"),
//   issuer: config.get("auth0IssuerBaseUrl"),
//   algorithms: ["RS256"],
// });

import { Request, Response, NextFunction } from "express";

const checkAuth0AccessToken = async (req: Request, res: Response, next: NextFunction) => {
  return next();
};

export default checkAuth0AccessToken;
