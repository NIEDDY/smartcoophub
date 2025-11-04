import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockActivityLogs, mockCooperatives } from '../lib/mockData';
import { Activity, Shield, Users, DollarSign, FileText } from 'lucide-react';

interface ActivityLogsProps {
  cooperativeId?: string;
  userId?: string;
  limit?: number;
  showCooperativeName?: boolean;
}

export function ActivityLogs({ cooperativeId, userId, limit = 10, showCooperativeName = false }: ActivityLogsProps) {
  const getActionIcon = (action: string) => {
    if (action.includes('transaction') || action.includes('payment')) {
      return DollarSign;
    }
    if (action.includes('member') || action.includes('user')) {
      return Users;
    }
    if (action.includes('cooperative') || action.includes('approved')) {
      return Shield;
    }
    if (action.includes('report') || action.includes('document')) {
      return FileText;
    }
    return Activity;
  };

  const getActionColor = (action: string) => {
    if (action.includes('approved') || action.includes('completed')) {
      return 'text-[#8BC34A]';
    }
    if (action.includes('rejected') || action.includes('deleted')) {
      return 'text-red-600';
    }
    if (action.includes('pending') || action.includes('invited')) {
      return 'text-yellow-600';
    }
    return 'text-[#0288D1]';
  };

  let filteredLogs = mockActivityLogs;
  
  if (cooperativeId) {
    filteredLogs = filteredLogs.filter(log => log.cooperativeId === cooperativeId);
  }
  
  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === userId);
  }
  
  const logs = filteredLogs.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>
          Complete audit trail of all actions (Read-only for accountability)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity logs found
            </p>
          ) : (
            logs.map((log) => {
              const Icon = getActionIcon(log.action);
              const color = getActionColor(log.action);
              
              return (
                <div 
                  key={log.id} 
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`${color.replace('text-', 'bg-')}/10 p-2 rounded`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <p className="text-sm">{log.userName}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {log.userRole}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                      {showCooperativeName && log.cooperativeId && (
                        <Badge variant="outline" className="text-xs">
                          {mockCooperatives.find(c => c.id === log.cooperativeId)?.name}
                        </Badge>
                      )}
                      {log.metadata && (
                        <span className="text-xs text-muted-foreground">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {typeof value === 'number' ? value.toLocaleString() : value}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
