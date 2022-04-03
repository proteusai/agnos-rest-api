export default {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URL || "mongodb://localhost:27017/agnos",
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  accessTokenPrivateKey: ``,
  accessTokenPublicKey: ``,
  refreshTokenPrivateKey: ``,
  refreshTokenPublicKey: ``,
};
