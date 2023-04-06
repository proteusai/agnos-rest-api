# Agnos REST API

This is the REST API powering the various Agnos clients.

## Getting Started

### Running Locally (Development Build)

- Create `.env` file in the project root directory and populate it accordingly. See `.env.example` for environment variables expected in `.env`
- Run `yarn` to install dependencies.
- Run `yarn dev` to run the development version
- Using Docker:
  - First, build the Docker image: `docker build --target development -t agnos-rest-api:dev .`
  - Then, run the docker image: `docker run -p 3000:3000 agnos-rest-api:dev`
- Using Docker Compose: `docker-compose up --build`

### Testing Locally (Using Docker)

- Create `.test.env` file in the project root directory and populate it accordingly. See `.env.example` for environment variables expected in `.test.env`
- Run `yarn docker:compose:test` to start the relevant Docker containers. The command `yarn test` will then be automatically run in the _agnos-rest-api-api_ container.

### Building for Production

- Run `yarn docker:build:prod` which runs the following command: `docker build --target production -t agnos-rest-api .`

## Tools

- [Commitlint](https://commitlint.js.org/#/)
- [ESLint](https://eslint.org/)
- [Husky](https://github.com/typicode/husky)
- [Jest](https://jestjs.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [OpenAPI](https://www.openapis.org/)
- [Prettier](https://prettier.io/)
- [Swagger](https://swagger.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)

## Resources

- [How to Setup a TypeScript + Node.js Project](https://khalilstemmler.com/blogs/typescript/node-starter-project)
- [How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript)
- [How to use Prettier with ESLint and TypeScript in VSCode](https://khalilstemmler.com/blogs/tooling/prettier)
- [Enforcing Coding Conventions with Husky Pre-commit Hooks](https://khalilstemmler.com/blogs/tooling/enforcing-husky-precommit-hooks)
- [Convert Swagger documentation to Postman Collection](https://medium.com/c-sharp-progarmming/convert-swagger-documentation-to-postman-collection-d67fc95c7b14)
- [Testing Mongoose with Ts-Jest](https://dev.to/dinckan_berat/testing-mongoose-with-ts-jest-264f)
- [Path aliases with TypeScript in Node.js](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)
