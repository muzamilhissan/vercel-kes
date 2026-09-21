import { User } from '../api/types';

/**
 * Safely retrieve and parse the currently authenticated user from localStorage.
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Check whether a user has administrative privileges (Admin / Superadmin).
 */
export const isSuperAdmin = (user?: User | null): boolean => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser) return false;

  // Check roles array (e.g. { id: 19, name: "admin" } or { name: "Superadmin" })
  if (Array.isArray(targetUser.roles) && targetUser.roles.length > 0) {
    return targetUser.roles.some(role => {
      if (!role || !role.name) return false;
      const normalized = role.name.toLowerCase().replace(/[\s\-_]/g, '');
      return normalized === 'admin' || normalized === 'superadmin' || normalized === 'superadministrator';
    });
  }

  // Check direct role property
  const anyUser = targetUser as any;
  if (anyUser.role) {
    const normalizedRole = String(anyUser.role).toLowerCase().replace(/[\s\-_]/g, '');
    return normalizedRole === 'admin' || normalizedRole === 'superadmin' || normalizedRole === 'superadministrator';
  }

  // Fallback to designation
  if (targetUser.designation) {
    const normalizedDesig = targetUser.designation.toLowerCase().replace(/[\s\-_]/g, '');
    return normalizedDesig === 'admin' || normalizedDesig === 'superadmin' || normalizedDesig === 'superadministrator';
  }

  return false;
};

/**
 * Get user ID as string for consistent comparison.
 */
export const getUserId = (user?: User | null): string => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser || targetUser.id === undefined || targetUser.id === null) return '';
  return String(targetUser.id);
};

/**
 * Extract all unique permission names assigned to the user
 * (from both user.roles[].permissions and direct user.permissions).
 */
export const getUserPermissions = (user?: User | null): string[] => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser) return [];

  const permissionsSet = new Set<string>();

  // Extract from roles
  if (Array.isArray(targetUser.roles)) {
    targetUser.roles.forEach(role => {
      if (Array.isArray(role.permissions)) {
        role.permissions.forEach(perm => {
          if (perm && perm.name) {
            permissionsSet.add(perm.name.trim());
          }
        });
      }
    });
  }

  // Extract from direct permissions
  if (Array.isArray(targetUser.permissions)) {
    targetUser.permissions.forEach(perm => {
      if (perm && perm.name) {
        permissionsSet.add(perm.name.trim());
      }
    });
  }

  return Array.from(permissionsSet);
};

/**
 * Check if the current user has a specific permission.
 * Admins/Superadmins automatically have access.
 */
export const hasPermission = (permissionName: string, user?: User | null): boolean => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser) return false;

  // Superadmin / Admin bypass
  if (isSuperAdmin(targetUser)) return true;

  const permissions = getUserPermissions(targetUser);
  const normalizedTarget = permissionName.toLowerCase().replace(/[\s\-_]/g, '');
  
  return permissions.some(p => p.toLowerCase().replace(/[\s\-_]/g, '') === normalizedTarget);
};

/**
 * Check if the user has any of the given permissions.
 */
export const hasAnyPermission = (permissionNames: string[], user?: User | null): boolean => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser) return false;

  if (isSuperAdmin(targetUser)) return true;

  const permissions = getUserPermissions(targetUser);
  const normalizedTargets = permissionNames.map(p => p.toLowerCase().replace(/[\s\-_]/g, ''));

  return permissions.some(p => normalizedTargets.includes(p.toLowerCase().replace(/[\s\-_]/g, '')));
};

/**
 * Check if the user has all of the given permissions.
 */
export const hasAllPermissions = (permissionNames: string[], user?: User | null): boolean => {
  const targetUser = user !== undefined ? user : getCurrentUser();
  if (!targetUser) return false;

  if (isSuperAdmin(targetUser)) return true;

  const permissions = getUserPermissions(targetUser);
  const normalizedPerms = new Set(permissions.map(p => p.toLowerCase().replace(/[\s\-_]/g, '')));

  return permissionNames.every(p => normalizedPerms.has(p.toLowerCase().replace(/[\s\-_]/g, '')));
};

