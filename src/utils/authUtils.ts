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
