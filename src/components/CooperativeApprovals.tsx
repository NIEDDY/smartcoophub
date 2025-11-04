import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  MapPin,
  Users,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  FileText,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { cooperativeService } from '../lib/services/cooperative.service';

export function CooperativeApprovals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCooperative, setSelectedCooperative] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real cooperatives from database
  useEffect(() => {
    const fetchCooperatives = async () => {
      try {
        const response = await cooperativeService.getAll();
        const data = response.data || response;
        
        // Handle wrapped response
        let coopsData = data;
        if (data?.cooperatives && Array.isArray(data.cooperatives)) {
          coopsData = data.cooperatives;
        }
        
        setCooperatives(Array.isArray(coopsData) ? coopsData : []);
      } catch (error) {
        console.error('Error fetching cooperatives:', error);
        setCooperatives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCooperatives();
  }, []);

  const pendingCooperatives = cooperatives.filter(c => c.status?.toUpperCase() === 'PENDING');
  const approvedCooperatives = cooperatives.filter(c => c.status?.toUpperCase() === 'APPROVED');
  const rejectedCooperatives = cooperatives.filter(c => c.status?.toUpperCase() === 'REJECTED');

  const getFilteredCooperatives = () => {
    let coops = cooperatives;
    
    if (filterStatus === 'pending') {
      coops = pendingCooperatives;
    } else if (filterStatus === 'approved') {
      coops = approvedCooperatives;
    } else if (filterStatus === 'rejected') {
      coops = rejectedCooperatives;
    }

    if (searchTerm) {
      coops = coops.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return coops;
  };

  const filteredCooperatives = getFilteredCooperatives();

  const handleApprove = async (cooperative: any) => {
    try {
      await cooperativeService.approve(cooperative.id);
      toast.success(`${cooperative.name} has been approved successfully!`, {
        description: 'The cooperative admin will be notified via email and can now access the platform.'
      });
      setShowDetailsDialog(false);
      setSelectedCooperative(null);
      // Refresh the cooperatives list
      window.location.reload();
    } catch (error) {
      console.error('Failed to approve cooperative:', error);
      toast.error('Failed to approve cooperative. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await cooperativeService.reject(selectedCooperative.id);
      toast.success(`${selectedCooperative.name} has been rejected.`, {
        description: 'The cooperative admin will be notified with the reason for rejection.'
      });
      
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
      setSelectedCooperative(null);
      setRejectionReason('');
      // Refresh the cooperatives list
      window.location.reload();
    } catch (error) {
      console.error('Failed to reject cooperative:', error);
      toast.error('Failed to reject cooperative. Please try again.');
    }
  };

  const viewDetails = (cooperative: any) => {
    setSelectedCooperative(cooperative);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case 'APPROVED':
        return 'bg-[#8BC34A]/10 text-[#8BC34A] border-[#8BC34A]/20';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-500';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Cooperative Approvals</h2>
        <p className="text-muted-foreground">
          Review and approve cooperative registration requests
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pendingCooperatives.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8BC34A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#8BC34A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{approvedCooperatives.length}</div>
            <p className="text-xs text-muted-foreground">Active cooperatives</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{rejectedCooperatives.length}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Alert */}
      {pendingCooperatives.length > 0 && (
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-500">
            You have {pendingCooperatives.length} cooperative{pendingCooperatives.length !== 1 ? 's' : ''} waiting for approval. Please review and take action.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Cooperative Applications</CardTitle>
              <CardDescription>Manage all cooperative registration requests</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cooperatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={filterStatus} onValueChange={(v: string) => setFilterStatus(v as 'pending' | 'approved' | 'rejected' | 'all')} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingCooperatives.length > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0">
                    {pendingCooperatives.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={filterStatus} className="space-y-4">
              {filteredCooperatives.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No cooperatives found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCooperatives.map((coop) => (
                    <div
                      key={coop.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="bg-[#0288D1]/10 p-2 rounded-lg">
                            <Building2 className="h-5 w-5 text-[#0288D1]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm">{coop.name}</h4>
                              <Badge className={getStatusColor(coop.status)}>
                                {coop.status}
                              </Badge>
                            </div>
                            <div className="grid gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                <span>{coop.type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{coop.address || coop.location || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{coop.totalMembers || coop.memberCount || 0} members</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span>{coop.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewDetails(coop)}
                        >
                          View Details
                        </Button>
                        {coop.status?.toUpperCase() === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-[#8BC34A] hover:bg-[#7CB342] text-white"
                              onClick={() => handleApprove(coop)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedCooperative(coop);
                                setShowRejectDialog(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cooperative Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#0288D1]" />
              {selectedCooperative?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed information about the cooperative registration
            </DialogDescription>
          </DialogHeader>

          {selectedCooperative && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedCooperative.status)}>
                  {selectedCooperative.status}
                </Badge>
                {selectedCooperative.registeredDate && (
                  <span className="text-xs text-muted-foreground">
                    Registered: {new Date(selectedCooperative.registeredDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Cooperative Name</Label>
                  <p className="text-sm">{selectedCooperative.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="text-sm">{selectedCooperative.type}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Registration Number</Label>
                  <p className="text-sm">{selectedCooperative.registrationNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Established Date</Label>
                  <p className="text-sm">{new Date(selectedCooperative.establishedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0288D1]" />
                  Location Details
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Province</Label>
                    <p className="text-sm">{selectedCooperative.province}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">District</Label>
                    <p className="text-sm">{selectedCooperative.district}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Sector</Label>
                    <p className="text-sm">{selectedCooperative.sector}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Full Address</Label>
                  <p className="text-sm">{selectedCooperative.location}</p>
                </div>
              </div>

              {/* Leadership */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0288D1]" />
                  Leadership
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Chairperson</Label>
                    <p className="text-sm">{selectedCooperative.chairperson}</p>
                  </div>
                  {selectedCooperative.treasurer && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Treasurer</Label>
                      <p className="text-sm">{selectedCooperative.treasurer}</p>
                    </div>
                  )}
                  {selectedCooperative.secretary && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Secretary</Label>
                      <p className="text-sm">{selectedCooperative.secretary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(selectedCooperative.adminEmail || selectedCooperative.adminPhone) && (
                <div className="space-y-3">
                  <h4 className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#0288D1]" />
                    Contact Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedCooperative.adminEmail && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-sm">{selectedCooperative.adminEmail}</p>
                      </div>
                    )}
                    {selectedCooperative.adminPhone && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <p className="text-sm">{selectedCooperative.adminPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Members */}
              <div className="space-y-3">
                <h4 className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0288D1]" />
                  Membership
                </h4>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Initial Member Count</Label>
                  <p className="text-sm">{selectedCooperative.memberCount} members</p>
                </div>
              </div>

              {/* Description */}
              {selectedCooperative.description && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedCooperative.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedCooperative.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-[#8BC34A] hover:bg-[#7CB342] text-white"
                    onClick={() => handleApprove(selectedCooperative)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Cooperative
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowRejectDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cooperative Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedCooperative?.name}. The cooperative admin will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Explain why this cooperative registration is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
