/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/', '<rootDir>/config/'],
  moduleNameMapper: {
    "^@/(.+)$": "<rootDir>/src/$1",
    "^@app$": "<rootDir>/src/app",
    "^@constants/(.+)$": "<rootDir>/src/constants/$1",
    "^@controllers/([\\w]+).controller$": "<rootDir>/src/features/$1/controller/$1.controller",
    "^@features/(.+)$": "<rootDir>/src/features/$1",
    "^@middleware/(.+)$": "<rootDir>/src/middleware/$1",
    "^@models/([\\w]+).model$": "<rootDir>/src/features/$1/model/$1.model",
    "^@routes$": "<rootDir>/src/routes",
    "^@routes/([\\w]+).routes$": "<rootDir>/src/features/$1/routes/$1.routes",
    "^@schemas/([\\w]+).schemas$": "<rootDir>/src/features/$1/schemas/$1.schemas",
    "^@services/([\\w]+).service$": "<rootDir>/src/features/$1/service/$1.service",
    "^@types$": "<rootDir>/src/types",
    "^@utils/(.+)$": "<rootDir>/src/utils/$1",
  },
};