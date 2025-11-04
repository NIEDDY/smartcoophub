import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { permissions } from '../lib/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Please log in to continue.</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            Your role ({permissions.getRoleDescription(user.role)}) does not have access to this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user || !permissions.hasPermission(user.role, permission as any)) {
    return fallback || null;
  }

  return <>{children}</>;
}
