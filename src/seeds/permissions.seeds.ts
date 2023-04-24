import PermissionModel, { PermissionInput } from "../models/permission.model";

async function seedPermissions() {
  const permissions: Array<PermissionInput & { _id: string }> = [
    {
      _id: "read",
      name: "read",
      value: 10,
      description: "Read-only permission",
    },
    {
      _id: "write",
      name: "write",
      value: 100,
      description: "Read-write permission",
    },
    {
      _id: "admin",
      name: "admin",
      value: 1000,
      description: "Administrative permission",
    },
  ];

  await PermissionModel.deleteMany({});
  await PermissionModel.insertMany(permissions);
}

export default seedPermissions;
