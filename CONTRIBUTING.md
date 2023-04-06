# Agnos REST API

Welcome!

## Contributing a Model

This section discusses the checklist you have to be mindful of if you are adding a new model or editing an existing one.

Let's assume that the model is called _Thing_.

- [ ] In _src/features/thing/model/thing.model.ts_ create the Mongoose schema, document, model etc.
- [ ] In _src/features/thing/model/thing.mode.test.ts_ create tests for the Mongoose schema, document, model etc.
- [ ] In _src/features/thing/schemas/thing.schemas.ts_ create the Zod schema.
- [ ] In _src/features/thing/schemas/thing.schemas.ts_ create the OpenAPI documentations for the schemas `Thing`, `CreateThingInput`, and `CreateThingResponse`.
- [ ] In _src/features/thing/schemas/thing.schemas.test.ts_ create tests for the `CreateThingInput` schema.
- [ ] In _src/features/thing/service/thing.service.ts_ create services.
- [ ] In _src/features/thing/service/thing.service.test.ts_ create tests for the services.
- [ ] In _src/features/thing/controllers/thing.controller.ts_ create controllers.
- [ ] In _src/features/thing/controllers/thing.controller.test.ts_ create tests for the controllers.
- [ ] In _src/features/thing/routes/thing.routes.ts_ create routes.
- [ ] In _src/features/thing/routes/thing.routes.ts_ add `checkAuth0AccessToken` middleware to appropriate routes.
- [ ] In _src/features/thing/routes/thing.routes.ts_ add OpenAPI documentations to routes.
- [ ] In _src/features/thing/routes/thing.routes.test.ts_ create tests for routes.
- [ ] In _tsconfig.json_, in the array `compilerOptions.paths.controllers`, add `"src/features/thing/controller/*"`.
- [ ] In _tsconfig.json_, in the array `compilerOptions.paths.models`, add `"src/features/thing/model/*"`.
- [ ] In _tsconfig.json_, in the array `compilerOptions.paths.routes`, add `"src/features/thing/routes/*"`.
- [ ] In _tsconfig.json_, in the array `compilerOptions.paths.schemas`, add `"src/features/thing/schemas/*"`.
- [ ] In _tsconfig.json_, in the array `compilerOptions.paths.services`, add `"src/features/thing/service/*"`.
- [ ] In _package.json_, in the object `_moduleAliases`, add `"@controllers/thing.controller": "build/src/features/thing/controller/thing.controller",`.
- [ ] In _package.json_, in the object `_moduleAliases`, add `"@models/thing.model": "build/src/features/thing/model/thing.model",`.
- [ ] In _package.json_, in the object `_moduleAliases`, add `"@routes/thing.routes": "build/src/features/thing/routes/thing.routes",`.
- [ ] In _package.json_, in the object `_moduleAliases`, add `"@schemas/thing.schemas": "build/src/features/thing/schemas/thing.schemas",`.
- [ ] In _package.json_, in the object `_moduleAliases`, add `"@services/thing.service": "build/src/features/thing/service/thing.service",`.
