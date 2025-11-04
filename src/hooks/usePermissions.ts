import { useAuth } from '../contexts/AuthContext';
import { permissions, Permission } from '../lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  if (!user) {
    return {
      user: null,
      hasPermission: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
      canApproveCooperatives: () => false,
      canManageUsers: () => false,
      canManageMembers: () => false,
      canManageProducts: () => false,
      canApproveRequests: () => false,
      canPlaceOrders: () => false,
      canRateProducts: () => false,
      canViewAuditLogs: () => false,
      isReadOnly: () => false,
    };
  }

  return {
    user,
    hasPermission: (permission: Permission) => permissions.hasPermission(user.role, permission),
    hasAnyPermission: (perms: Permission[]) => permissions.hasAnyPermission(user.role, perms),
    hasAllPermissions: (perms: Permission[]) => permissions.hasAllPermissions(user.role, perms),
    canApproveCooperatives: () => permissions.canApproveCooperatives(user.role),
    canManageUsers: () => permissions.canManageUsers(user.role),
    canManageMembers: () => permissions.canManageMembers(user.role),
    canManageProducts: () => permissions.canManageProducts(user.role),
    canApproveRequests: () => permissions.canApproveRequests(user.role),
    canPlaceOrders: () => permissions.canPlaceOrders(user.role),
    canRateProducts: () => permissions.canRateProducts(user.role),
    canViewAuditLogs: () => permissions.canViewAuditLogs(user.role),
    isReadOnly: () => permissions.isReadOnly(user.role),
  };
}
