import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface CooperativeStatusGuardProps {
  status: string;
  cooperativeName: string;
  children: React.ReactNode;
}

export function CooperativeStatusGuard({ status, cooperativeName, children }: CooperativeStatusGuardProps) {
  const isApproved = status === 'APPROVED';
  const isPending = status === 'PENDING';
  const isRejected = status === 'REJECTED';
  const isSuspended = status === 'SUSPENDED';

  if (isApproved) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {isPending && (
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 border">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-500 ml-2">
            <strong>{cooperativeName}</strong> is pending approval from the Super Admin. You won't be able to post products or perform certain actions until your cooperative is approved.
          </AlertDescription>
        </Alert>
      )}

      {isRejected && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 border">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-500 ml-2">
            <strong>{cooperativeName}</strong> registration has been rejected. Please contact support for more information.
          </AlertDescription>
        </Alert>
      )}

      {isSuspended && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 border">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-500 ml-2">
            <strong>{cooperativeName}</strong> has been suspended. Please contact support for assistance.
          </AlertDescription>
        </Alert>
      )}

      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

interface CooperativeStatusBadgeProps {
  status: string;
}

export function CooperativeStatusBadge({ status }: CooperativeStatusBadgeProps) {
  switch (status) {
    case 'APPROVED':
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="h-3 w-3 mr-1" />
          Pending Approval
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Suspended
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
