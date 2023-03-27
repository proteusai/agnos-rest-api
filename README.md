# Agnos REST API

This is the REST API powering the various Agnos clients.

## Getting Started

### Running Locally (Development Build)

- Run `yarn` to install dependencies.
- Run `yarn dev` to run the development version
- Using Docker:
  - First, build the Docker image: `docker build --target development -t agnos-rest-api:dev .`
  - Then, run the docker image: `docker run -p 3000:3000 agnos-rest-api:dev`
- Using Docker Compose: `docker-compose up`

### Building for Production

- `docker build --target development -t agnos-rest-api:dev .`

## Tools

- [Commitlint](https://commitlint.js.org/#/)
- [ESLint](https://eslint.org/)
- [Husky](https://github.com/typicode/husky)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)

## Resources

- [How to Setup a TypeScript + Node.js Project](https://khalilstemmler.com/blogs/typescript/node-starter-project)
- [How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript)
- [How to use Prettier with ESLint and TypeScript in VSCode](https://khalilstemmler.com/blogs/tooling/prettier)
- [Enforcing Coding Conventions with Husky Pre-commit Hooks](https://khalilstemmler.com/blogs/tooling/enforcing-husky-precommit-hooks)
