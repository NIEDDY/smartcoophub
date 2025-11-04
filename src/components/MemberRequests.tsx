import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockMemberRequests } from '../lib/mockData';
import { Plus, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MemberRequestsProps {
  memberId?: string;
  cooperativeId?: string;
  isAdmin?: boolean;
}

export function MemberRequests({ memberId, cooperativeId, isAdmin = false }: MemberRequestsProps) {
  const [openNewRequest, setOpenNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'loan',
    title: '',
    description: '',
    amount: '',
  });

  const handleSubmitRequest = () => {
    if (!newRequest.title || !newRequest.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Request submitted successfully');
    setOpenNewRequest(false);
    setNewRequest({
      type: 'loan',
      title: '',
      description: '',
      amount: '',
    });
  };

  const handleApproveRequest = (requestId: string, requestTitle: string) => {
    toast.success(`Approved: ${requestTitle}`);
  };

  const handleRejectRequest = (requestId: string, requestTitle: string) => {
    toast.error(`Rejected: ${requestTitle}`);
  };

  let requests = mockMemberRequests;
  
  if (memberId) {
    requests = requests.filter(r => r.memberId === memberId);
  } else if (cooperativeId) {
    requests = requests.filter(r => r.cooperativeId === cooperativeId);
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'loan':
        return 'bg-blue-100 text-blue-700';
      case 'withdrawal':
        return 'bg-purple-100 text-purple-700';
      case 'complaint':
        return 'bg-red-100 text-red-700';
      case 'resignation':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-[#8BC34A]" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Member Requests</CardTitle>
            <CardDescription>
              {isAdmin 
                ? 'Review and respond to member requests' 
                : 'Submit and track your requests'}
            </CardDescription>
          </div>
          {!isAdmin && (
            <Dialog open={openNewRequest} onOpenChange={setOpenNewRequest}>
              <DialogTrigger asChild>
                <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit New Request</DialogTitle>
                  <DialogDescription>
                    Submit a request to the cooperative administration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="request-type">Request Type *</Label>
                    <Select 
                      value={newRequest.type} 
                      onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}
                    >
                      <SelectTrigger id="request-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loan">Loan Request</SelectItem>
                        <SelectItem value="withdrawal">Savings Withdrawal</SelectItem>
                        <SelectItem value="complaint">File Complaint</SelectItem>
                        <SelectItem value="resignation">Resignation Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-title">Title *</Label>
                    <Input
                      id="request-title"
                      placeholder="Brief title of your request"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-description">Description *</Label>
                    <Textarea
                      id="request-description"
                      placeholder="Provide detailed information about your request..."
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  {(newRequest.type === 'loan' || newRequest.type === 'withdrawal') && (
                    <div className="space-y-2">
                      <Label htmlFor="request-amount">Amount (RWF)</Label>
                      <Input
                        id="request-amount"
                        type="number"
                        placeholder="0"
                        value={newRequest.amount}
                        onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOpenNewRequest(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitRequest}
                    className="bg-[#0288D1] hover:bg-[#0277BD]"
                  >
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'No pending requests' : 'You haven\'t submitted any requests yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm">{request.title}</h4>
                      {getStatusIcon(request.status)}
                    </div>
                    {isAdmin && (
                      <p className="text-xs text-muted-foreground">
                        Requested by {request.memberName}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {request.description}
                    </p>
                    {request.amount && (
                      <p className="text-sm mt-2">
                        Amount: <span className="text-[#0288D1]">
                          {request.amount.toLocaleString()} RWF
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted on {request.submittedDate}
                    </p>
                    {request.reviewedBy && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <p>
                          Reviewed by {request.reviewedBy} on {request.reviewedDate}
                        </p>
                        {request.reviewNotes && (
                          <p className="mt-1">Notes: {request.reviewNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getTypeColor(request.type)}>
                      {request.type.replace('_', ' ')}
                    </Badge>
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
                </div>
                
                {isAdmin && request.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      className="bg-[#8BC34A] hover:bg-[#7CB342]"
                      onClick={() => handleApproveRequest(request.id, request.title)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectRequest(request.id, request.title)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
