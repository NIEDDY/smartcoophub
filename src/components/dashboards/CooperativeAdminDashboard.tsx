import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { mockCooperatives, mockMembers, mockTransactions, mockProducts, mockCooperativeDocuments } from '../../lib/mockData';
import { ActivityLogs } from '../ActivityLogs';
import { ApprovalSystem } from '../ApprovalSystem';
import { MemberRequests } from '../MemberRequests';
import { CooperativeStatusGuard, CooperativeStatusBadge } from '../CooperativeStatusGuard';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  UserPlus,
  BookOpen,
  Upload,
  UserX,
  Settings,
  Shield
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function CooperativeAdminDashboard() {
  const { user } = useAuth();
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openAddPolicy, setOpenAddPolicy] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    shares: '0',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    content: '',
    category: 'governance',
    document: null as File | null,
  });

  // Mock cooperative policies
  const [cooperativePolicies, setCooperativePolicies] = useState([
    {
      id: 'pol1',
      title: 'Membership Requirements',
      description: 'Guidelines for cooperative membership',
      category: 'membership',
      effectiveDate: '2020-03-15',
      createdBy: user?.name || 'Admin',
      createdDate: '2020-03-15',
    },
    {
      id: 'pol2',
      title: 'Financial Contribution Policy',
      description: 'Monthly contribution requirements and payment schedules',
      category: 'financial',
      effectiveDate: '2020-03-15',
      createdBy: user?.name || 'Admin',
      createdDate: '2020-03-15',
    },
  ]);
  
  const cooperative = user?.cooperativeId 
    ? mockCooperatives.find(c => c.id === user.cooperativeId)
    : mockCooperatives[0];
    
  const members = mockMembers.filter(m => m.cooperativeId === cooperative?.id);
  const transactions = mockTransactions.filter(t => t.cooperativeId === cooperative?.id);
  const products = mockProducts.filter(p => p.cooperativeId === cooperative?.id);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalContributions = transactions
    .filter(t => t.type === 'contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Total Members',
      value: members.length,
      icon: Users,
      description: 'Active members',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Total Income',
      value: `${(totalIncome / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      description: 'This month (RWF)',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
    {
      title: 'Products Listed',
      value: products.length,
      icon: Package,
      description: 'On marketplace',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Net Profit',
      value: `${((totalIncome - totalExpenses) / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      description: 'This month (RWF)',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
  ];

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Generate a mock invitation code
    const invitationCode = 'INV' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const invitationLink = `${window.location.origin}?invitation=${invitationCode}`;
    
    // Show success message with invitation code
    toast.success(
      `Member invited successfully! Invitation code: ${invitationCode}`,
      { duration: 8000 }
    );
    
    // In real app, this would send an email with the invitation link
    console.log('Invitation Link:', invitationLink);
    
    setOpenAddMember(false);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      shares: '0',
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Transaction recorded successfully');
    setOpenAddTransaction(false);
    setNewTransaction({
      type: 'income',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleGenerateReport = () => {
    toast.success('Generating report... This will be downloaded shortly.');
  };

  const handleAddPolicy = () => {
    if (!newPolicy.title || !newPolicy.description || !newPolicy.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const policy = {
      id: 'pol' + (cooperativePolicies.length + 1),
      ...newPolicy,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: user?.name || 'Admin',
      createdDate: new Date().toISOString().split('T')[0],
    };
    
    setCooperativePolicies([...cooperativePolicies, policy]);
    toast.success('Policy added successfully');
    setOpenAddPolicy(false);
    setNewPolicy({
      title: '',
      description: '',
      content: '',
      category: 'governance',
      document: null,
    });
  };

  const handleDeactivateMember = (memberId: string, memberName: string) => {
    toast.success(`${memberName}'s account has been deactivated`);
    // In a real app, this would update the member's status in the backend
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    toast.success(`${memberName} has been removed from the cooperative`);
    // In a real app, this would delete the member from the backend
  };

  return (
    <div className="space-y-6">
      <CooperativeStatusGuard 
        status={cooperative?.status?.toUpperCase() || 'PENDING'} 
        cooperativeName={cooperative?.name || 'Your Cooperative'}
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#8BC34A]/10 to-[#0288D1]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2>Welcome back, {user?.name}</h2>
              <p className="text-muted-foreground mb-4">
                {cooperative?.name} - {cooperative?.location}
              </p>
              <CooperativeStatusBadge status={cooperative?.status?.toUpperCase() || 'PENDING'} />
            </div>
          </div>
        <div className="flex flex-wrap gap-3">
          <Dialog open={openAddMember} onOpenChange={setOpenAddMember}>
            <DialogTrigger asChild>
              <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new member. They will receive an invitation code to complete their registration.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Full Name *</Label>
                  <Input
                    id="member-name"
                    placeholder="John Doe"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">Email Address *</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="john@example.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-phone">Phone Number</Label>
                  <Input
                    id="member-phone"
                    placeholder="+250 XXX XXX XXX"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">Cooperative Role</Label>
                  <Select value={newMember.role} onValueChange={(value: string) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger id="member-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-shares">Initial Shares</Label>
                  <Input
                    id="member-shares"
                    type="number"
                    placeholder="0"
                    value={newMember.shares}
                    onChange={(e) => setNewMember({ ...newMember, shares: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpenAddMember(false)}>Cancel</Button>
                <Button onClick={handleAddMember} className="bg-[#0288D1] hover:bg-[#0277BD]">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openAddTransaction} onOpenChange={setOpenAddTransaction}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Record Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>Add income, expense, or contribution</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Type *</Label>
                  <Select value={newTransaction.type} onValueChange={(value: string) => setNewTransaction({ ...newTransaction, type: value })}>
                    <SelectTrigger id="transaction-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="contribution">Contribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-amount">Amount (RWF) *</Label>
                  <Input
                    id="transaction-amount"
                    type="number"
                    placeholder="50000"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-description">Description *</Label>
                  <Textarea
                    id="transaction-description"
                    placeholder="Describe the transaction"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction-date">Date</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpenAddTransaction(false)}>Cancel</Button>
                <Button onClick={handleAddTransaction} className="bg-[#8BC34A] hover:bg-[#7CB342]">
                  Record Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
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

      {/* Role Badge */}
      {user?.cooperativeRole && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0288D1]" />
                <div>
                  <p className="text-sm">Your Cooperative Role</p>
                  <p className="text-xs text-muted-foreground">Access level and permissions</p>
                </div>
              </div>
              <Badge className="bg-[#0288D1]/10 text-[#0288D1] capitalize">
                {user.cooperativeRole}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {(user?.cooperativeRole === 'admin' || user?.cooperativeRole === 'secretary') && (
            <TabsTrigger value="members">Members</TabsTrigger>
          )}
          {(user?.cooperativeRole === 'admin' || user?.cooperativeRole === 'accountant' || user?.cooperativeRole === 'secretary') && (
            <TabsTrigger value="finances">Finances</TabsTrigger>
          )}
          {user?.cooperativeRole === 'admin' && (
            <TabsTrigger value="products">Products</TabsTrigger>
          )}
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="requests">Member Requests</TabsTrigger>
          {(user?.cooperativeRole === 'admin' || user?.cooperativeRole === 'secretary') && (
            <TabsTrigger value="documents">Documents</TabsTrigger>
          )}
          {user?.cooperativeRole === 'admin' && (
            <TabsTrigger value="policies">Policies</TabsTrigger>
          )}
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Current month performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Income</span>
                    <span className="text-[#8BC34A]">+{(totalIncome / 1000).toFixed(0)}K RWF</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="text-red-600">-{(totalExpenses / 1000).toFixed(0)}K RWF</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Contributions</span>
                    <span className="text-[#0288D1]">{(totalContributions / 1000).toFixed(0)}K RWF</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                      <div className={`text-sm ${
                        transaction.type === 'income' ? 'text-[#8BC34A]' : 
                        transaction.type === 'expense' ? 'text-red-600' : 
                        'text-[#0288D1]'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {(transaction.amount / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>{members.length} registered members</CardDescription>
                </div>
                <Button onClick={() => setOpenAddMember(true)} className="bg-[#0288D1] hover:bg-[#0277BD]">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Contributions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.shares}</TableCell>
                      <TableCell>{(member.contributions / 1000).toFixed(0)}K RWF</TableCell>
                      <TableCell>
                        <Badge className={member.status === 'active' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' : 'bg-gray-100 text-gray-700'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <UserX className="h-4 w-4 text-orange-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to deactivate {member.name}'s account? 
                                  They will lose access to the platform but their data will be preserved.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeactivateMember(member.id, member.name)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  Deactivate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete {member.name} from the cooperative? 
                                  This action cannot be undone and will remove all their data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMember(member.id, member.name)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Records</CardTitle>
                  <CardDescription>All income, expenses, and contributions</CardDescription>
                </div>
                <Button onClick={() => setOpenAddTransaction(true)} className="bg-[#8BC34A] hover:bg-[#7CB342]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{transaction.date}</TableCell>
                      <TableCell>
                        <Badge className={
                          transaction.type === 'income' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' :
                          transaction.type === 'expense' ? 'bg-red-100 text-red-700' :
                          'bg-[#0288D1]/10 text-[#0288D1]'
                        }>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{transaction.description}</TableCell>
                      <TableCell className={`text-sm ${
                        transaction.type === 'income' ? 'text-[#8BC34A]' :
                        transaction.type === 'expense' ? 'text-red-600' :
                        'text-[#0288D1]'
                      }`}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {transaction.amount.toLocaleString()} RWF
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Listings</CardTitle>
                  <CardDescription>Manage marketplace products</CardDescription>
                </div>
                <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{product.name}</CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </div>
                        <Badge className={product.availability === 'in-stock' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' : 'bg-gray-100 text-gray-700'}>
                          {product.availability}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-2">{product.price.toLocaleString()} RWF / {product.unit}</p>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cooperative Policies</CardTitle>
                  <CardDescription>Manage policies and guidelines for your cooperative</CardDescription>
                </div>
                <Dialog open={openAddPolicy} onOpenChange={setOpenAddPolicy}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Policy</DialogTitle>
                      <DialogDescription>
                        Create a new policy document for your cooperative members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label htmlFor="policy-title">Policy Title *</Label>
                        <Input
                          id="policy-title"
                          placeholder="e.g., Membership Requirements"
                          value={newPolicy.title}
                          onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-category">Category *</Label>
                        <Select value={newPolicy.category} onValueChange={(value: string) => setNewPolicy({ ...newPolicy, category: value })}>
                          <SelectTrigger id="policy-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="governance">Governance</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="membership">Membership</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-description">Description *</Label>
                        <Input
                          id="policy-description"
                          placeholder="Brief description of the policy"
                          value={newPolicy.description}
                          onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-content">Policy Content *</Label>
                        <Textarea
                          id="policy-content"
                          placeholder="Detailed policy content and guidelines..."
                          rows={6}
                          value={newPolicy.content}
                          onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-document">Supporting Document (Optional)</Label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                          <input
                            id="policy-document"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setNewPolicy({ ...newPolicy, document: file });
                              }
                            }}
                            className="hidden"
                          />
                          <label htmlFor="policy-document" className="cursor-pointer">
                            {newPolicy.document ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-[#8BC34A]">
                                  <FileText className="h-6 w-6" />
                                </div>
                                <p className="text-sm">{newPolicy.document.name}</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                                <p className="text-sm">Upload supporting document</p>
                                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setOpenAddPolicy(false)}>Cancel</Button>
                      <Button onClick={handleAddPolicy} className="bg-[#0288D1] hover:bg-[#0277BD]">
                        Create Policy
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cooperativePolicies.map((policy) => (
                  <Card key={policy.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-[#0288D1]" />
                            <h4 className="text-base">{policy.title}</h4>
                            <Badge variant="outline" className="capitalize text-xs">
                              {policy.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{policy.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created by: {policy.createdBy}</span>
                            <span>Effective: {policy.effectiveDate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {cooperativePolicies.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No policies created yet</p>
                    <p className="text-sm text-muted-foreground">Start by creating your first policy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-[#8BC34A]/5 p-4 rounded-lg border border-[#8BC34A]/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#8BC34A] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm mb-2">
                  <strong>Policy Management Tips:</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Keep policies clear and easy to understand</li>
                  <li>• Update policies regularly to reflect current practices</li>
                  <li>• All members can view these policies from their dashboard</li>
                  <li>• Consider adding supporting documents for complex policies</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalSystem cooperativeId={cooperative?.id} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <MemberRequests cooperativeId={cooperative?.id} isAdmin={true} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cooperative Documents</CardTitle>
                  <CardDescription>Upload and manage official documents</CardDescription>
                </div>
                <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCooperativeDocuments
                  .filter(d => d.cooperativeId === cooperative?.id)
                  .map((doc) => (
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
                            <Badge variant="outline" className="text-xs capitalize">
                              {doc.visibility.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {doc.uploadedBy} • {doc.uploadedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ActivityLogs cooperativeId={cooperative?.id} limit={15} />
        </TabsContent>
      </Tabs>
      </CooperativeStatusGuard>
    </div>
  );
}
