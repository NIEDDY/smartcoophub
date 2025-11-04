import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { mockCooperatives, mockMembers, mockTransactions, mockAnnouncements, mockMemberFinancialRecords, mockCooperativeDocuments } from '../../lib/mockData';
import { MemberRequests } from '../MemberRequests';
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase,
  Share2,
  Calendar,
  Bell,
  History,
  Award,
  FileText,
  UserX,
  Download,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { PaymentDialog } from '../PaymentDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function MemberDashboard() {
  const { user, logout } = useAuth();
  const [openPayment, setOpenPayment] = useState(false);
  
  const cooperative = user?.cooperativeId 
    ? mockCooperatives.find(c => c.id === user.cooperativeId)
    : mockCooperatives[0];
    
  const memberData = mockMembers.find(m => m.email === user?.email) || mockMembers[3];
  const recentAnnouncements = mockAnnouncements
    .filter(a => a.cooperativeId === cooperative?.id && a.status === 'active')
    .slice(0, 3);
  
  // Get member's financial record
  const memberFinancial = mockMemberFinancialRecords.find(f => f.memberId === memberData.id);
  
  // Get cooperative documents visible to members
  const cooperativeDocuments = mockCooperativeDocuments.filter(
    d => d.cooperativeId === cooperative?.id && 
    (d.visibility === 'all_members' || d.visibility === 'public')
  );

  // Mock cooperative policies
  const cooperativePolicies = [
    {
      id: 'pol1',
      title: 'Membership Requirements',
      description: 'Guidelines for cooperative membership',
      category: 'membership',
      effectiveDate: '2020-03-15',
    },
    {
      id: 'pol2',
      title: 'Financial Contribution Policy',
      description: 'Monthly contribution requirements and payment schedules',
      category: 'financial',
      effectiveDate: '2020-03-15',
    },
    {
      id: 'pol3',
      title: 'Governance Structure',
      description: 'Leadership roles and decision-making processes',
      category: 'governance',
      effectiveDate: '2020-03-15',
    },
  ];

  const handleDeactivateAccount = () => {
    toast.success('Account deactivation request submitted. The admin will review your request.');
    // In a real app, this would send a request to the backend
  };

  // Get member's contribution history
  const memberTransactions = mockTransactions.filter(
    t => t.cooperativeId === cooperative?.id && t.type === 'contribution'
  ).slice(0, 5);

  const stats = [
    {
      title: 'My Contributions',
      value: `${(memberData.contributions / 1000).toFixed(0)}K RWF`,
      description: 'Total contributions',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
      icon: DollarSign,
    },
    {
      title: 'My Shares',
      value: memberData.shares,
      description: 'Total shares owned',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
      icon: Share2,
    },
    {
      title: 'Member Since',
      value: new Date(memberData.joinDate).getFullYear(),
      description: memberData.joinDate,
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
      icon: Calendar,
    },
    {
      title: 'My Role',
      value: memberData.role.charAt(0).toUpperCase() + memberData.role.slice(1),
      description: 'Current position',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
      icon: Award,
    },
  ];

  const allMembers = mockMembers.filter(m => m.cooperativeId === cooperative?.id);
  const myRanking = allMembers
    .sort((a, b) => b.contributions - a.contributions)
    .findIndex(m => m.id === memberData.id) + 1;
  
  const maxContribution = Math.max(...allMembers.map(m => m.contributions));
  const avgContribution = allMembers.reduce((sum, m) => sum + m.contributions, 0) / allMembers.length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#8BC34A]/10 to-[#0288D1]/10 rounded-lg p-6">
        <h2>Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          Member of {cooperative?.name}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
            {memberData.status === 'active' ? 'Active Member' : 'Inactive'}
          </Badge>
          {memberData.contributions > avgContribution && (
            <Badge className="bg-[#0288D1]/10 text-[#0288D1]">
              <Award className="h-3 w-3 mr-1" />
              Top Contributor
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finances">My Finances</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="cooperative">Cooperative Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Contribution Progress */}
          <Card>
            <CardHeader>
              <CardTitle>My Contribution Performance</CardTitle>
              <CardDescription>Your standing in the cooperative</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Contribution Rank</span>
                  <span className="text-sm">#{myRanking} of {allMembers.length} members</span>
                </div>
                <Progress 
                  value={((allMembers.length - myRanking + 1) / allMembers.length) * 100} 
                  className="h-3" 
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-[#8BC34A]/10 rounded-lg">
                  <div className="text-2xl text-[#8BC34A] mb-1">
                    {(memberData.contributions / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-muted-foreground">My Total</div>
                </div>
                <div className="text-center p-4 bg-[#0288D1]/10 rounded-lg">
                  <div className="text-2xl text-[#0288D1] mb-1">
                    {(avgContribution / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#8BC34A]/10 to-[#0288D1]/10 rounded-lg">
                  <div className="text-2xl mb-1">{memberData.shares}</div>
                  <div className="text-xs text-muted-foreground">My Shares</div>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm mb-2">Performance Insights</p>
                {memberData.contributions > avgContribution ? (
                  <p className="text-xs text-muted-foreground">
                    Excellent! You've contributed {((memberData.contributions / avgContribution - 1) * 100).toFixed(0)}% 
                    more than the average member. Keep up the great work!
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    You're contributing well. Consider increasing your contributions to reach the top performers.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Updates from your cooperative</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <div className="bg-[#0288D1]/10 p-2 rounded">
                      <Briefcase className="h-4 w-4 text-[#0288D1]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm">{announcement.title}</p>
                          <p className="text-xs text-muted-foreground">{announcement.type}</p>
                        </div>
                      </div>
                      {announcement.deadline && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Deadline: {announcement.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No announcements at the moment
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          {/* Financial Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#0288D1]">{memberFinancial?.shares || memberData.shares}</div>
                <p className="text-xs text-muted-foreground">Owned shares</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#8BC34A]">
                  {((memberFinancial?.savings || 0) / 1000).toFixed(0)}K RWF
                </div>
                <p className="text-xs text-muted-foreground">Available savings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Dividends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#0288D1]">
                  {((memberFinancial?.dividends || 0) / 1000).toFixed(0)}K RWF
                </div>
                <p className="text-xs text-muted-foreground">Total dividends</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {((memberFinancial?.loans || 0) / 1000).toFixed(0)}K RWF
                </div>
                <p className="text-xs text-muted-foreground">Outstanding loans</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Financial Record */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Financial Record</CardTitle>
              <CardDescription>
                View-only financial transparency (Members cannot alter data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Contributions</p>
                      <p className="text-xl">
                        {((memberFinancial?.totalContributions || memberData.contributions) / 1000).toFixed(0)}K RWF
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Share Value</p>
                      <p className="text-xl text-[#0288D1]">
                        {(((memberFinancial?.totalContributions || memberData.contributions) / (memberFinancial?.shares || memberData.shares)) / 1000).toFixed(1)}K RWF
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-sm">{memberFinancial?.lastUpdated || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Member Status</p>
                      <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
                        {memberData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#0288D1]/5 rounded-lg border border-[#0288D1]/20">
                  <p className="text-sm">
                    <strong>Transparency Note:</strong> All financial records are view-only and cannot be modified by members. 
                    Any discrepancies should be reported to the cooperative accountant or administration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Your payment records and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{transaction.date}</TableCell>
                      <TableCell className="text-sm">{transaction.description}</TableCell>
                      <TableCell className="text-sm text-[#8BC34A]">
                        +{transaction.amount.toLocaleString()} RWF
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Profit Share</CardTitle>
              <CardDescription>Expected returns based on your contributions and shares</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Shares</p>
                    <p className="text-2xl">{memberData.shares}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Share Value</p>
                    <p className="text-2xl text-[#8BC34A]">
                      {((memberData.contributions / memberData.shares) / 1000).toFixed(1)}K RWF
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-[#8BC34A]/10 rounded-lg">
                  <p className="text-sm mb-2">Estimated Annual Return</p>
                  <p className="text-2xl text-[#8BC34A]">
                    {((memberData.contributions * 0.12) / 1000).toFixed(0)}K RWF
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on 12% cooperative dividend rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <MemberRequests memberId={memberData.id} cooperativeId={cooperative?.id} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cooperative Documents</CardTitle>
              <CardDescription>
                Access shared documents and reports from your cooperative
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cooperativeDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents available
                </p>
              ) : (
                <div className="space-y-3">
                  {cooperativeDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-[#0288D1]/10 p-2 rounded">
                          <FileText className="h-4 w-4 text-[#0288D1]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {doc.type.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Uploaded: {doc.uploadedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm">
                  All documents are provided for transparency and member information. 
                  Members have read-only access and cannot modify any documents. 
                  Contact the cooperative administration if you need any clarifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Opportunities & Announcements</CardTitle>
              <CardDescription>Latest opportunities for members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
                        <CardDescription>{announcement.type}</CardDescription>
                      </div>
                      <Badge className="bg-[#0288D1]/10 text-[#0288D1]">
                        {announcement.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {announcement.description}
                    </p>
                    {announcement.deadline && (
                      <p className="text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Deadline: {announcement.deadline}
                      </p>
                    )}
                    <Button size="sm" className="bg-[#0288D1] hover:bg-[#0277BD]">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {recentAnnouncements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No opportunities available at the moment. Check back later!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cooperative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cooperative Information</CardTitle>
              <CardDescription>About {cooperative?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cooperative Name</p>
                    <p className="text-base">{cooperative?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-base">{cooperative?.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-base">{cooperative?.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="text-base">{cooperative?.establishedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-base">{cooperative?.memberCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={cooperative?.status === 'active' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' : 'bg-gray-100 text-gray-700'}>
                      {cooperative?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cooperative Policies</CardTitle>
              <CardDescription>Important policies and guidelines for members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cooperativePolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-[#0288D1]" />
                        <p className="text-sm">{policy.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Effective: {policy.effectiveDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {policy.category}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#0288D1]/5 rounded-lg border border-[#0288D1]/20">
                <p className="text-sm">
                  <strong>Note:</strong> All members are required to read and understand these policies. 
                  Contact the cooperative admin if you have any questions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leadership Committee</CardTitle>
              <CardDescription>Current cooperative leaders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allMembers
                  .filter(m => ['admin', 'accountant', 'secretary'].includes(m.role))
                  .map((leader) => (
                    <div key={leader.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="text-sm">{leader.name}</p>
                        <p className="text-xs text-muted-foreground">{leader.email}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {leader.role}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>What would you like to do?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="w-full bg-[#0288D1] hover:bg-[#0277BD]"
              onClick={() => setOpenPayment(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Make Contribution
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              View Shares
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download Statement
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded">
                <UserX className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm">Deactivate Account</p>
                <p className="text-xs text-muted-foreground">
                  Temporarily disable your cooperative membership
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to deactivate your account? This will:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Temporarily suspend your membership privileges</li>
                      <li>Stop any recurring contributions</li>
                      <li>Require admin approval to reactivate</li>
                    </ul>
                    <p className="mt-2">Your shares and contribution history will be preserved.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivateAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Deactivate Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <PaymentDialog
        open={openPayment}
        onOpenChange={setOpenPayment}
        paymentType="contribution"
        description="Monthly membership contribution"
        onPaymentComplete={() => {
          toast.success('Contribution payment completed!');
        }}
      />
    </div>
  );
}
