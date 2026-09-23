import { hasPermission } from "../../rbac";
import type { Permission, Role } from "../../types";

export type AccessContext = {
  role: Role;
  entitlements?: ReadonlySet<string>;
};

export function can(
  context: AccessContext,
  permission?: Permission,
  entitlement?: string
): boolean {
  if (permission && !hasPermission(context.role, permission)) return false;
  if (entitlement && !context.entitlements?.has(entitlement)) return false;
  return true;
}
