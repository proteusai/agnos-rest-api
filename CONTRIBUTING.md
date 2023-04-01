# Agnos REST API

Welcome!

## Contributing a Model

This section discusses the checklist you have to be mindful of if you are adding a new model or editing an existing one.

Let's assume that the model is called _Thing_.

- [ ] In _src/features/thing/model/thing.model.ts_ create the Mongoose schema, document, model etc.
- [ ] In _src/features/thing/model/thing.mode.test.ts_ create tests for the Mongoose schema, document, model etc.
- [ ] In _src/features/thing/schema/thing.schema.ts_ create the Zod schema.
- [ ] In _src/features/thing/schema/thing.schema.ts_ create the OpenAPI documentations for the schemas `Thing`, `CreateThingInput`, and `CreateThingResponse`.
- [ ] In _src/features/thing/schema/thing.schema.test.ts_ create tests for the `CreateThingInput` schema.
- [ ] In _src/features/thing/service/thing.service.ts_ create services.
- [ ] In _src/features/thing/service/thing.service.test.ts_ create tests for the services.
- [ ] In _src/features/thing/controllers/thing.controller.ts_ create controllers.
- [ ] In _src/features/thing/controllers/thing.controller.test.ts_ create tests for the controllers.
- [ ] In _src/features/thing/routes/thing.routes.ts_ create routes.
- [ ] In _src/features/thing/routes/thing.routes.ts_ add `checkAuth0AccessToken` middleware to appropriate routes.
- [ ] In _src/features/thing/routes/thing.routes.ts_ add OpenAPI documentations to routes.
- [ ] In _src/features/thing/routes/thing.routes.test.ts_ create tests for routes.
