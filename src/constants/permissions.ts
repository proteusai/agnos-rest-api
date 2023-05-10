export enum PermissionName {
  "read" = "read",
  "write" = "write",
  "admin" = "admin",
}
export enum PermissionScope {
  "read:design" = "read:design",
  "read:environment" = "read:environment",
  "read:org" = "read:org",
  "read:project" = "read:project",
  "read:user" = "read:user",
}

export enum RoleName {
  "guest" = "guest",
  "member" = "member",
  "owner" = "owner",
}

export const MapPermissionToValue: Record<PermissionName, number> = {
  read: 1,
  write: 10,
  admin: 100,
};

export const MapRoleToValue: Record<RoleName, number> = {
  guest: 1,
  member: 10,
  owner: 100,
};

export type ResourceTypes = "org" | "team" | "component" | "project";

export type ResourceIdLocation = "body.org" | "params.component" | "params.org" | "params.project" | "query.org";
