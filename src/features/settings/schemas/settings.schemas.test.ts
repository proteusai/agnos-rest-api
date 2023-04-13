import { UpdateSettingsRequest, updateSettingsRequestSchema } from "@schemas/settings";

describe("Update settings schema", () => {
  it("should validate well-formed objects", async () => {
    const request: UpdateSettingsRequest = {
      body: {
        autoSave: true,
        colorMode: "DARK",
        useGrayscaleIcons: true,
      },
    };
    expect(() => {
      updateSettingsRequestSchema.parse(request);
    }).not.toThrowError();
    expect(updateSettingsRequestSchema.parse(request)).toEqual(request);
  });
});
