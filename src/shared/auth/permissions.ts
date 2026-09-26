import type { User } from '@/shared/types/api';

const ADMIN_ROLES = new Set(['admin', 'superadmin', 'superadministrator']);

/** Lowercase and strip spaces/dashes/underscores so role and permission names compare reliably. */
const normalize = (value: string) => value.toLowerCase().replace(/[\s\-_]/g, '');

export function isSuperAdmin(user: User | null): boolean {
  if (!user) return false;

  if (user.roles?.length) {
    return user.roles.some((role) => role?.name && ADMIN_ROLES.has(normalize(role.name)));
  }
  if (user.role) return ADMIN_ROLES.has(normalize(String(user.role)));
  if (user.designation) return ADMIN_ROLES.has(normalize(user.designation));

  return false;
}

export function getUserId(user: User | null): string {
  return user?.id == null ? '' : String(user.id);
}

/** Every permission name granted to the user, via their roles or assigned directly. */
export function getUserPermissions(user: User | null): string[] {
  if (!user) return [];

  const names = new Set<string>();
  for (const role of user.roles ?? []) {
    for (const permission of role.permissions ?? []) {
      if (permission?.name) names.add(permission.name.trim());
    }
  }
  for (const permission of user.permissions ?? []) {
    if (permission?.name) names.add(permission.name.trim());
  }
  return [...names];
}

export function hasPermission(user: User | null, name: string): boolean {
  return hasAnyPermission(user, [name]);
}

export function hasAnyPermission(user: User | null, names: string[]): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const granted = new Set(getUserPermissions(user).map(normalize));
  return names.some((name) => granted.has(normalize(name)));
}

export function hasAllPermissions(user: User | null, names: string[]): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const granted = new Set(getUserPermissions(user).map(normalize));
  return names.every((name) => granted.has(normalize(name)));
}
