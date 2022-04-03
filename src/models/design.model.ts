import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    flow: { type: {}, required: true },
    environments: [
      {
        title: { type: String, required: true },
        provisions: [
          {
            component: { id: { type: String, required: true } },
            provider: {
              type: {
                title: { type: String, required: true },
                handler: { type: String, required: true },
                headers: {},
                data: {},
              },
              required: true,
            },
          },
        ],
      },
    ],
    teamId: { type: String, required: true },
    secrets: {},
  },
  {
    timestamps: true,
  }
);
