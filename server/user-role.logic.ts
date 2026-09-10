export type AppRole = "user" | "admin";

export function initialUserRole(providedRole: AppRole | undefined, isConfiguredOwner: boolean): AppRole {
  return providedRole ?? (isConfiguredOwner ? "admin" : "user");
}

export function shouldUpdateExistingRole(providedRole: AppRole | undefined, isConfiguredOwner: boolean) {
  return providedRole !== undefined || isConfiguredOwner;
}
