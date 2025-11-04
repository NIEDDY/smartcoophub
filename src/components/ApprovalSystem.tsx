import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockApprovalRequests } from '../lib/mockData';
import { CheckCircle, XCircle, Clock, DollarSign, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface ApprovalSystemProps {
  cooperativeId?: string;
}

export function ApprovalSystem({ cooperativeId }: ApprovalSystemProps) {
  const { user } = useAuth();
  const [openApproval, setOpenApproval] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return DollarSign;
      case 'member_approval':
        return Users;
      case 'loan':
        return DollarSign;
      default:
        return FileText;
    }
  };

  const handleApprove = (requestId: string, requestTitle: string) => {
    toast.success(`Approved: ${requestTitle}`);
    setOpenApproval(null);
    setApprovalNotes('');
  };

  const handleReject = (requestId: string, requestTitle: string) => {
    if (!approvalNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    toast.error(`Rejected: ${requestTitle}`);
    setOpenApproval(null);
    setApprovalNotes('');
  };

  const requests = cooperativeId
    ? mockApprovalRequests.filter(r => r.cooperativeId === cooperativeId)
    : mockApprovalRequests;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Approval System</CardTitle>
        <CardDescription>
          Critical actions require approval from multiple committee members
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No pending approvals
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const Icon = getTypeIcon(request.type);
              const approvalCount = request.approvals.filter(a => a.approved).length;
              const progress = (approvalCount / request.requiredApprovals) * 100;
              
              return (
                <div 
                  key={request.id} 
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-[#0288D1]/10 p-2 rounded">
                        <Icon className="h-4 w-4 text-[#0288D1]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm">{request.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.description}
                        </p>
                        {request.amount && (
                          <p className="text-sm mt-1">
                            Amount: <span className="text-[#0288D1]">
                              {request.amount.toLocaleString()} RWF
                            </span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Initiated by {request.initiatedBy} on {request.initiatedDate}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        request.status === 'approved' 
                          ? 'bg-[#8BC34A]/10 text-[#8BC34A]' 
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>

                  {/* Approval Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Approvals: {approvalCount}/{request.requiredApprovals}
                      </span>
                      <span className="text-muted-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Approvals List */}
                  {request.approvals.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs">Approval History:</p>
                      {request.approvals.map((approval, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded"
                        >
                          {approval.approved ? (
                            <CheckCircle className="h-3 w-3 text-[#8BC34A]" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )}
                          <span>
                            {approval.userName} ({approval.role})
                          </span>
                          <span className="text-muted-foreground">
                            {approval.approved ? 'approved' : 'rejected'}
                          </span>
                          <span className="text-muted-foreground ml-auto">
                            {new Date(approval.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {request.status === 'pending' && user?.cooperativeRole !== 'member' && (
                    <div className="flex gap-2">
                      <Dialog 
                        open={openApproval === request.id} 
                        onOpenChange={(open: boolean) => {
                          setOpenApproval(open ? request.id : null);
                          if (!open) setApprovalNotes('');
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-[#8BC34A] hover:bg-[#7CB342]">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Request</DialogTitle>
                            <DialogDescription>
                              Review and approve this request
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <p className="text-sm">{request.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {request.description}
                              </p>
                              {request.amount && (
                                <p className="text-sm mt-2">
                                  Amount: <span className="text-[#0288D1]">
                                    {request.amount.toLocaleString()} RWF
                                  </span>
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="approval-notes">Notes (Optional)</Label>
                              <Textarea
                                id="approval-notes"
                                placeholder="Add any notes about this approval..."
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setOpenApproval(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleApprove(request.id, request.title)}
                              className="bg-[#8BC34A] hover:bg-[#7CB342]"
                            >
                              Confirm Approval
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Request</DialogTitle>
                            <DialogDescription>
                              Provide a reason for rejecting this request
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <p className="text-sm">{request.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {request.description}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="rejection-notes">
                                Reason for Rejection *
                              </Label>
                              <Textarea
                                id="rejection-notes"
                                placeholder="Explain why this request is being rejected..."
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setOpenApproval(null);
                                setApprovalNotes('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleReject(request.id, request.title)}
                              variant="destructive"
                            >
                              Confirm Rejection
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
