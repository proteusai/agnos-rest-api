# Agnos REST API

Welcome!

## Contributing a Model

This section discusses the checklist you have to be mindful of if you are adding a new model or editing an existing one.

Let's assume that the model is called _thing_.

- [ ] In _src/models/thing.model.ts_ create the Mongoose schema, document, model etc.
- [ ] In _src/models/thing.mode.test.ts_ create tests for the Mongoose schema, document, model etc.
- [ ] In _src/schema/thing.schema.ts_ create the Zod schema.
- [ ] In _src/schema/thing.schema.ts_ create the OpenAPI documentations for the schemas `Thing`, `CreateThingInput`, and `CreateThingResponse`.
- [ ] In _src/schema/thing.schema.test.ts_ create tests for the `CreateThingInput` schema.
- [ ] In _src/service/thing.service.ts_ create services.
- [ ] In _src/service/thing.service.test.ts_ create tests for the services.
- controller
- route
