import { UserRole } from '../types';

export type Permission = 
  | 'view_dashboard'
  | 'manage_cooperatives'
  | 'approve_registrations'
  | 'manage_users'
  | 'view_reports'
  | 'view_transactions'
  | 'manage_marketplace'
  | 'manage_announcements'
  | 'manage_members'
  | 'manage_payments'
  | 'place_orders'
  | 'rate_products'
  | 'view_analytics'
  | 'approve_requests'
  | 'manage_products'
  | 'view_audit_logs';

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'view_dashboard',
    'manage_cooperatives',
    'approve_registrations',
    'manage_users',
    'view_reports',
    'view_transactions',
    'view_analytics',
    'manage_announcements',
    'view_audit_logs',
  ],
  COOP_ADMIN: [
    'view_dashboard',
    'manage_members',
    'manage_marketplace',
    'manage_products',
    'manage_announcements',
    'manage_payments',
    'approve_requests',
    'view_reports',
    'view_transactions',
  ],
  SECRETARY: [
    'view_dashboard',
    'manage_announcements',
    'view_transactions',
  ],
  ACCOUNTANT: [
    'view_dashboard',
    'view_reports',
    'view_transactions',
    'manage_payments',
  ],
  MEMBER: [
    'view_dashboard',
    'place_orders',
    'rate_products',
    'view_transactions',
    'manage_announcements',
  ],
  BUYER: [
    'view_dashboard',
    'place_orders',
    'rate_products',
    'manage_marketplace',
    'manage_announcements',
    'view_transactions',
  ],
  RCA_REGULATOR: [
    'view_dashboard',
    'view_reports',
    'view_transactions',
    'view_audit_logs',
  ],
};

export const permissions = {
  hasPermission: (role: UserRole, permission: Permission): boolean => {
    return rolePermissions[role]?.includes(permission) ?? false;
  },

  hasAnyPermission: (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.some(p => rolePermissions[role]?.includes(p) ?? false);
  },

  hasAllPermissions: (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.every(p => rolePermissions[role]?.includes(p) ?? false);
  },

  canApproveCooperatives: (role: UserRole): boolean => {
    return role === 'SUPER_ADMIN';
  },

  canManageUsers: (role: UserRole): boolean => {
    return role === 'SUPER_ADMIN';
  },

  canManageMembers: (role: UserRole): boolean => {
    return role === 'COOP_ADMIN' || role === 'SUPER_ADMIN';
  },

  canManageProducts: (role: UserRole): boolean => {
    return role === 'COOP_ADMIN' || role === 'BUYER';
  },

  canApproveRequests: (role: UserRole): boolean => {
    return role === 'COOP_ADMIN' || role === 'SUPER_ADMIN';
  },

  canPlaceOrders: (role: UserRole): boolean => {
    return role === 'BUYER' || role === 'MEMBER';
  },

  canRateProducts: (role: UserRole): boolean => {
    return role === 'BUYER' || role === 'MEMBER';
  },

  canViewAuditLogs: (role: UserRole): boolean => {
    return role === 'SUPER_ADMIN' || role === 'RCA_REGULATOR';
  },

  isReadOnly: (role: UserRole): boolean => {
    return role === 'RCA_REGULATOR';
  },

  getRoleDescription: (role: UserRole): string => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'System Administrator - Full platform access';
      case 'COOP_ADMIN':
        return 'Cooperative Administrator - Manage cooperative operations';
      case 'SECRETARY':
        return 'Secretary - Manage cooperative announcements and communications';
      case 'ACCOUNTANT':
        return 'Accountant - Manage financial records and payments';
      case 'MEMBER':
        return 'Cooperative Member - Access member features';
      case 'BUYER':
        return 'Buyer - Browse and purchase products';
      case 'RCA_REGULATOR':
        return 'RCA Regulator - Monitor cooperatives (read-only)';
      default:
        return 'User';
    }
  },
};
