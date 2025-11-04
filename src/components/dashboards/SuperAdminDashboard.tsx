import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ActivityLogs } from '../ActivityLogs';
import { cooperativeService } from '../../lib/services/cooperative.service';
import { systemService } from '../../lib/services/system.service';
import { orderService } from '../../lib/services/product.service';
import { 
  Users, 
  Building2, 
  DollarSign,
  Activity,
  AlertCircle,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

interface SuperAdminDashboardProps {
  onNavigateToApprovals?: () => void;
}

export function SuperAdminDashboard({ onNavigateToApprovals }: SuperAdminDashboardProps = {}) {
  const navigate = useNavigate();
  const [openAddCooperative, setOpenAddCooperative] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCooperative, setNewCooperative] = useState({
    name: '',
    type: '',
    location: '',
    district: '',
    sector: '',
    phone: '',
    email: '',
    chairperson: '',
    memberCount: '',
    establishedDate: '',
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel
        const [cooperativesRes, usersRes, transactionsRes, ordersRes, announcementsRes, statsRes] = await Promise.allSettled([
          cooperativeService.getAll(),
          systemService.getAllUsers({ limit: 50 }),
          systemService.getAllTransactions({ limit: 20 }),
          orderService.getAll({ limit: 20 }),
          systemService.getAllAnnouncements({ limit: 10 }),
          systemService.getStats(),
        ]);

        // Process responses
        console.log('API Results:', { cooperativesRes, usersRes, transactionsRes, ordersRes, announcementsRes, statsRes });
        
        if (cooperativesRes.status === 'fulfilled') {
          let data = cooperativesRes.value.data || cooperativesRes.value;
          // Handle wrapped response from backend
          if (data?.cooperatives && Array.isArray(data.cooperatives)) {
            data = data.cooperatives;
          }
          console.log('Cooperatives data:', data);
          setCooperatives(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch cooperatives:', cooperativesRes.reason);
          setCooperatives([]);
        }

        if (usersRes.status === 'fulfilled') {
          let data = usersRes.value.data || usersRes.value;
          // Handle wrapped response from backend
          if (data?.users && Array.isArray(data.users)) {
            data = data.users;
          }
          setUsers(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch users:', usersRes.reason);
          setUsers([]);
        }

        if (transactionsRes.status === 'fulfilled') {
          let data = transactionsRes.value.data || transactionsRes.value;
          // Handle wrapped response from backend
          if (data?.transactions && Array.isArray(data.transactions)) {
            data = data.transactions;
          }
          setTransactions(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch transactions:', transactionsRes.reason);
          setTransactions([]);
        }

        if (ordersRes.status === 'fulfilled') {
          let data = ordersRes.value.data || ordersRes.value;
          // Handle wrapped response from backend
          if (data?.items && Array.isArray(data.items)) {
            data = data.items;
          } else if (data?.orders && Array.isArray(data.orders)) {
            data = data.orders;
          }
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch orders:', ordersRes.reason);
          setOrders([]);
        }

        if (announcementsRes.status === 'fulfilled') {
          let data = announcementsRes.value.data || announcementsRes.value;
          // Handle wrapped response from backend
          if (data?.announcements && Array.isArray(data.announcements)) {
            data = data.announcements;
          }
          setAnnouncements(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch announcements:', announcementsRes.reason);
          setAnnouncements([]);
        }

        if (statsRes.status === 'fulfilled') {
          const data = statsRes.value.data || statsRes.value;
          setStats(data);
        } else {
          console.error('Failed to fetch stats:', statsRes.reason);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate statistics from real data
  const totalCooperatives = stats?.totalCooperatives || cooperatives.length;
  const activeCooperatives = stats?.approvedCooperatives || cooperatives.filter(
    c => c.status?.toUpperCase() === 'APPROVED' || c.status === 'active'
  ).length;
  const pendingCooperatives = stats?.pendingCooperatives || cooperatives.filter(
    c => c.status?.toUpperCase() === 'PENDING' || c.status === 'pending'
  ).length;
  const totalUsers = stats?.totalUsers || users.length;
  const totalTransactions = stats?.totalTransactions || transactions.length;
  const totalOrders = stats?.totalOrders || orders.length;
  const totalRevenue = stats?.totalRevenue || transactions
    .filter(t => t.type?.toUpperCase() === 'INCOME')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const activeAnnouncements = stats?.activeAnnouncements || announcements.filter(a => a.isPublic).length;

  const statsArray = [
    {
      title: 'Total Cooperatives',
      value: totalCooperatives,
      subtext: `${activeCooperatives} active, ${pendingCooperatives} pending`,
      icon: Building2,
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      subtext: 'Across all roles',
      icon: Users,
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
    {
      title: 'Platform Revenue',
      value: `${(totalRevenue / 1000000).toFixed(1)}M RWF`,
      subtext: 'Total transactions',
      icon: DollarSign,
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      subtext: `${orders.filter((o: any) => o.status?.toUpperCase() === 'DELIVERED').length} delivered`,
      icon: ShoppingCart,
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
  ];

  const handleAddCooperative = () => {
    if (!newCooperative.name || !newCooperative.type || !newCooperative.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Cooperative registration submitted for approval');
    setOpenAddCooperative(false);
    setNewCooperative({
      name: '',
      type: '',
      location: '',
      district: '',
      sector: '',
      phone: '',
      email: '',
      chairperson: '',
      memberCount: '',
      establishedDate: '',
    });
  };


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2>System Administration</h2>
          <p className="text-muted-foreground">
            Monitor and manage the entire Smart Cooperative Hub platform
          </p>
        </div>
        <div className="flex gap-2">
          {pendingCooperatives > 0 && (
            <Button 
              variant="outline" 
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 dark:text-yellow-500 dark:hover:bg-yellow-900/20"
              onClick={() => navigate('/approvals')}
            >
              <Clock className="h-4 w-4 mr-2" />
              {pendingCooperatives} Pending Approval{pendingCooperatives !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
        <Dialog open={openAddCooperative} onOpenChange={setOpenAddCooperative}>
          <DialogTrigger asChild>
            <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
              <Plus className="h-4 w-4 mr-2" />
              Register New Cooperative
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Cooperative</DialogTitle>
              <DialogDescription>
                Add a new cooperative to the Smart Cooperative Hub platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="coop-name">Cooperative Name *</Label>
                  <Input
                    id="coop-name"
                    placeholder="e.g., Kigali Coffee Cooperative"
                    value={newCooperative.name}
                    onChange={(e) => setNewCooperative({ ...newCooperative, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coop-type">Type *</Label>
                  <Select value={newCooperative.type} onValueChange={(value: string) => setNewCooperative({ ...newCooperative, type: value })}>
                    <SelectTrigger id="coop-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Tea">Tea</SelectItem>
                      <SelectItem value="Handicraft">Handicraft</SelectItem>
                      <SelectItem value="Savings & Credit">Savings & Credit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select value={newCooperative.district} onValueChange={(value: string) => setNewCooperative({ ...newCooperative, district: value })}>
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasabo">Gasabo</SelectItem>
                      <SelectItem value="Kicukiro">Kicukiro</SelectItem>
                      <SelectItem value="Nyarugenge">Nyarugenge</SelectItem>
                      <SelectItem value="Musanze">Musanze</SelectItem>
                      <SelectItem value="Huye">Huye</SelectItem>
                      <SelectItem value="Rubavu">Rubavu</SelectItem>
                      <SelectItem value="Rusizi">Rusizi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Input
                    id="sector"
                    placeholder="e.g., Remera"
                    value={newCooperative.sector}
                    onChange={(e) => setNewCooperative({ ...newCooperative, sector: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Full Address *</Label>
                <Textarea
                  id="location"
                  placeholder="e.g., Kigali, Gasabo District, Remera Sector"
                  value={newCooperative.location}
                  onChange={(e) => setNewCooperative({ ...newCooperative, location: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+250 XXX XXX XXX"
                    value={newCooperative.phone}
                    onChange={(e) => setNewCooperative({ ...newCooperative, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cooperative@example.com"
                    value={newCooperative.email}
                    onChange={(e) => setNewCooperative({ ...newCooperative, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="chairperson">Chairperson Name</Label>
                  <Input
                    id="chairperson"
                    placeholder="Full name"
                    value={newCooperative.chairperson}
                    onChange={(e) => setNewCooperative({ ...newCooperative, chairperson: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberCount">Initial Member Count</Label>
                  <Input
                    id="memberCount"
                    type="number"
                    placeholder="e.g., 50"
                    value={newCooperative.memberCount}
                    onChange={(e) => setNewCooperative({ ...newCooperative, memberCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="established">Established Date</Label>
                <Input
                  id="established"
                  type="date"
                  value={newCooperative.establishedDate}
                  onChange={(e) => setNewCooperative({ ...newCooperative, establishedDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpenAddCooperative(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCooperative} className="bg-[#0288D1] hover:bg-[#0277BD]">
                Register Cooperative
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Empty State Message */}
      {!loading && cooperatives.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>
            <strong>No cooperatives registered yet.</strong> Start by creating a new cooperative using the "Register New Cooperative" button above.
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsArray.map((stat) => (
          <Card key={stat.title} className="border-l-4" style={{ borderLeftColor: stat.color.replace('text-', '') }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cooperatives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cooperatives">Cooperatives</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cooperatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Cooperatives</CardTitle>
              <CardDescription>Manage and monitor all cooperatives on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cooperatives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No cooperatives registered yet
                </div>
              ) : (
                cooperatives.map((coop: any) => {
                  try {
                    const isApproved = coop.status?.toUpperCase() === 'APPROVED';
                    const isPending = coop.status?.toUpperCase() === 'PENDING';
                    
                    return (
                      <div key={coop.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{coop.name}</p>
                            {isApproved && <CheckCircle className="h-4 w-4 text-[#8BC34A]" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{coop.type} • {coop.address || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{coop.totalMembers || 0} members • Email: {coop.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={isApproved ? 'bg-[#8BC34A]/10 text-[#8BC34A]' : 'bg-yellow-100 text-yellow-700'}>
                            {coop.status || 'PENDING'}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => navigate('/approvals')}>
                            View
                          </Button>
                          {isPending && (
                            <Button size="sm" className="bg-[#0288D1] hover:bg-[#0277BD]" onClick={() => navigate('/approvals')}>
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  } catch (e) {
                    console.error('Error rendering cooperative:', e);
                    return null;
                  }
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Recent system-wide statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 border-b pb-3">
                  <div className="bg-[#8BC34A]/10 p-2 rounded">
                    <ShoppingCart className="h-4 w-4 text-[#8BC34A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{totalOrders} orders this month</p>
                    <p className="text-xs text-muted-foreground">Across all cooperatives</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-b pb-3">
                  <div className="bg-[#0288D1]/10 p-2 rounded">
                    <Activity className="h-4 w-4 text-[#0288D1]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{totalTransactions} transactions recorded</p>
                    <p className="text-xs text-muted-foreground">Blockchain verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#8BC34A]/10 p-2 rounded">
                    <AlertCircle className="h-4 w-4 text-[#8BC34A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activeAnnouncements} active announcements</p>
                    <p className="text-xs text-muted-foreground">Job postings and opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Cooperatives</span>
                    <span>{activeCooperatives}/{totalCooperatives}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1]" 
                      style={{ width: `${(activeCooperatives / totalCooperatives) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platform Uptime</span>
                    <span>99.9%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#8BC34A]" style={{ width: '99.9%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">User Satisfaction</span>
                    <span>4.9/5.0</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#0288D1]" style={{ width: '98%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Reports</CardTitle>
              <CardDescription>Monitor cooperative compliance and generate system reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCooperativesData.map((coop) => {
                const isApproved = coop.status?.toUpperCase() === 'APPROVED' || coop.status === 'active';
                
                return (
                  <div key={coop.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm">{coop.name}</p>
                      <p className="text-xs text-muted-foreground">Last report: {coop.updatedAt ? new Date(coop.updatedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={isApproved ? "bg-[#8BC34A]/10 text-[#8BC34A]" : "bg-yellow-100 text-yellow-700"}>
                        {isApproved ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compliant
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>Manage all users on the platform (RCA officers, cooperatives, buyers)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  users.map((systemUser) => {
                    const userCoop = systemUser.cooperativeId 
                      ? cooperatives.find(c => c.id === systemUser.cooperativeId)
                      : null;
                    
                    return (
                      <div key={systemUser.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="text-sm">{systemUser.firstName} {systemUser.lastName}</p>
                          <p className="text-xs text-muted-foreground">{systemUser.email}</p>
                          {userCoop && (
                            <p className="text-xs text-muted-foreground">{userCoop.name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            systemUser.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                            systemUser.role === 'COOP_ADMIN' ? 'bg-blue-100 text-blue-700' :
                            systemUser.role === 'RCA_REGULATOR' ? 'bg-green-100 text-green-700' :
                            systemUser.role === 'BUYER' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {systemUser.role?.replace(/_/g, ' ') || 'Unknown'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform-wide Transactions</CardTitle>
              <CardDescription>Monitor all financial transactions across cooperatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                ) : (
                  transactions.slice(0, 10).map((transaction) => {
                    const coop = cooperatives.find(c => c.id === transaction.cooperativeId);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {coop?.name || 'Unknown Cooperative'} • {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                          {transaction.blockchainHash && (
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Blockchain Verified
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">
                                {transaction.blockchainHash.substring(0, 8)}...
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={
                            transaction.type?.toUpperCase() === 'INCOME' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' :
                            transaction.type?.toUpperCase() === 'EXPENSE' ? 'bg-red-100 text-red-700' :
                            'bg-[#0288D1]/10 text-[#0288D1]'
                          }>
                            {transaction.type?.charAt(0).toUpperCase() + transaction.type?.slice(1).toLowerCase()}
                          </Badge>
                          <p className={`text-sm ${
                            transaction.type?.toUpperCase() === 'INCOME' ? 'text-[#8BC34A]' :
                            transaction.type?.toUpperCase() === 'EXPENSE' ? 'text-red-600' :
                            'text-[#0288D1]'
                          }`}>
                            {transaction.type?.toUpperCase() === 'EXPENSE' ? '-' : '+'}
                            {(transaction.amount / 1000).toFixed(0)}K RWF
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ActivityLogs showCooperativeName={true} limit={20} />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Manage cooperative subscriptions and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading subscriptions...</div>
              ) : cooperatives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No cooperatives found</div>
              ) : (
                cooperatives.map((coop) => (
                  <div key={coop.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm">{coop.name}</p>
                      <p className="text-xs text-muted-foreground">Plan: Standard • Status: {coop.status?.toUpperCase() || 'PENDING'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={coop.status?.toUpperCase() === 'APPROVED' ? "bg-[#8BC34A]/10 text-[#8BC34A]" : "bg-yellow-100 text-yellow-700"}>
                        {coop.status?.toUpperCase() === 'APPROVED' ? 'Active' : 'Pending'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}