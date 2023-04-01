import PermissionModel, { PermissionInput } from "../models/permission.model";

async function seedPermissions() {
  const permissions: Array<PermissionInput & { _id: string }> = [
    {
      _id: "READ",
      name: "READ",
      value: 10,
      description: "Read-only permission",
    },
    {
      _id: "WRITE",
      name: "WRITE",
      value: 100,
      description: "Read-write permission",
    },
    {
      _id: "ADMIN",
      name: "ADMIN",
      value: 1000,
      description: "Administrative permission",
    },
  ];

  await PermissionModel.deleteMany({});
  await PermissionModel.insertMany(permissions);
}

export default seedPermissions;
