export enum PermissionName {
  "READ" = "READ",
  "WRITE" = "WRITE",
  "ADMIN" = "ADMIN",
}
export enum PermissionScope {
  "READ:DESIGN" = "READ:DESIGN",
  "READ:ENVIRONMENT" = "READ:ENVIRONMENT",
  "READ:USER" = "READ:USER",
}

export enum RoleName {
  "GUEST" = "GUEST",
  "MEMBER" = "MEMBER",
  "OWNER" = "OWNER",
}

export const MapPermissionToValue: Record<PermissionName, number> = {
  READ: 1,
  WRITE: 10,
  ADMIN: 100,
};

export const MapRoleToValue: Record<RoleName, number> = {
  GUEST: 1,
  MEMBER: 10,
  OWNER: 100,
};
