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

- [TypeScript](https://www.typescriptlang.org/)
- [Yarn](https://yarnpkg.com/)

## Resources
