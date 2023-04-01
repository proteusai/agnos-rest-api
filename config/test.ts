export default {
  nodeEnv: process.env.NODE_ENV || "test",
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URL || "mongodb://db:27017/test",
  auth0Audience: process.env.AUTH0_AUDIENCE || "https://YOUR_DOMAIN/api/v2",
  auth0ClientId: process.env.AUTH0_CLIENT_ID || "client id",
  auth0IssuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL || "https://YOUR_DOMAIN",
  saltWorkFactor: 10,
  jwtSecret: process.env.JWT_SECRET || "A0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLlXNPXHIuXK9J+1QbWqrljX2I",
};
