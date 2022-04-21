export type PermissionName = "READ" | "WRITE" | "ADMIN";
export type PermissionScope = "READ:DESIGN" | "READ:ENVIRONMENT" | "READ:USER";
export const PermissionScopes = [
  "READ:DESIGN",
  "READ:ENVIRONMENT",
  "READ:USER",
];
