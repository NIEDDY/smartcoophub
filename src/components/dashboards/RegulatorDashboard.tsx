import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { mockCooperatives, mockReports, mockActivityLogs } from '../../lib/mockData';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Download,
  Eye,
  Bell,
  Shield,
  Activity,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export function RegulatorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAnnouncement, setOpenAnnouncement] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    cooperatives: 'all',
  });

  const activeCooperatives = mockCooperatives.filter(c => c.status === 'active');
  const allReports = mockReports;
  const rcaActivityLogs = mockActivityLogs.filter(log => !log.cooperativeId || log.userRole === 'regulator');

  const filteredCooperatives = activeCooperatives.filter(coop =>
    coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coop.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coop.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Registered Cooperatives',
      value: activeCooperatives.length,
      icon: Building2,
      description: 'Active cooperatives',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Total Members',
      value: activeCooperatives.reduce((sum, c) => sum + c.memberCount, 0).toLocaleString(),
      icon: Shield,
      description: 'Across all cooperatives',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
    {
      title: 'Reports Submitted',
      value: allReports.length,
      icon: FileText,
      description: 'This month',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Compliance Rate',
      value: '98%',
      icon: CheckCircle,
      description: 'Meeting standards',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
  ];

  const handleSendAnnouncement = () => {
    if (!announcement.title || !announcement.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Announcement sent successfully to cooperatives');
    setOpenAnnouncement(false);
    setAnnouncement({ title: '', message: '', cooperatives: 'all' });
  };

  const handleDownloadReport = (cooperativeName: string) => {
    toast.success(`Downloading report for ${cooperativeName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#8BC34A]/10 to-[#0288D1]/10 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-[#0288D1]" />
              <h2>RCA Regulator Dashboard</h2>
            </div>
            <p className="text-muted-foreground">
              Monitor cooperatives, review compliance, and ensure regulatory standards
            </p>
          </div>
          <Dialog open={openAnnouncement} onOpenChange={setOpenAnnouncement}>
            <DialogTrigger asChild>
              <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
                <Bell className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Announcement</DialogTitle>
                <DialogDescription>
                  Send important updates or notices to cooperatives
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title *</Label>
                  <Input
                    id="announcement-title"
                    placeholder="e.g., New Compliance Guidelines"
                    value={announcement.title}
                    onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-message">Message *</Label>
                  <Textarea
                    id="announcement-message"
                    placeholder="Enter your announcement message..."
                    value={announcement.message}
                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                    rows={5}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setOpenAnnouncement(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendAnnouncement} className="bg-[#0288D1] hover:bg-[#0277BD]">
                  Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
      <Tabs defaultValue="cooperatives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cooperatives">Cooperatives</TabsTrigger>
          <TabsTrigger value="reports">Performance Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="cooperatives" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registered Cooperatives</CardTitle>
                  <CardDescription>All active cooperatives under RCA supervision</CardDescription>
                </div>
                <div className="w-64">
                  <Input
                    placeholder="Search cooperatives..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cooperative Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCooperatives.map((coop) => (
                    <TableRow key={coop.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{coop.name}</p>
                          {coop.verified && (
                            <CheckCircle className="h-4 w-4 text-[#8BC34A]" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{coop.type}</TableCell>
                      <TableCell className="text-sm">
                        {coop.district}, {coop.sector}
                      </TableCell>
                      <TableCell className="text-sm">{coop.memberCount}</TableCell>
                      <TableCell className="text-sm">{coop.registrationNumber}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
                          {coop.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>Financial and operational reports from cooperatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cooperative</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Net Profit</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allReports.map((report) => {
                    const coop = mockCooperatives.find(c => c.id === report.cooperativeId);
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="text-sm">{coop?.name}</TableCell>
                        <TableCell className="text-sm">{report.period}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#8BC34A]">
                          +{(report.totalIncome / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-sm text-red-600">
                          -{(report.totalExpenses / 1000000).toFixed(1)}M
                        </TableCell>
                        <TableCell className="text-sm">
                          {(report.netProfit / 1000000).toFixed(1)}M RWF
                        </TableCell>
                        <TableCell className="text-sm">{report.generatedDate}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReport(coop?.name || '')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Activity Logs</CardTitle>
              <CardDescription>
                Read-only access to platform activities (RCA cannot modify data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivityLogs.slice(0, 10).map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="bg-[#0288D1]/10 p-2 rounded">
                      <Activity className="h-4 w-4 text-[#0288D1]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm">{log.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                        {log.cooperativeId && (
                          <Badge variant="outline" className="text-xs">
                            {mockCooperatives.find(c => c.id === log.cooperativeId)?.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Cooperative compliance with RCA regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCooperatives.slice(0, 6).map((coop) => (
                  <div key={coop.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm">{coop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last audit: 2 weeks ago
                      </p>
                    </div>
                    <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Overall system health and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#0288D1]" />
                    <span className="text-sm">Active Cooperatives</span>
                  </div>
                  <span className="text-sm">{activeCooperatives.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#8BC34A]" />
                    <span className="text-sm">Total Members</span>
                  </div>
                  <span className="text-sm">{activeCooperatives.reduce((sum, c) => sum + c.memberCount, 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0288D1]" />
                    <span className="text-sm">Reports Submitted</span>
                  </div>
                  <span className="text-sm">{allReports.length} this quarter</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#8BC34A]" />
                    <span className="text-sm">Compliance Rate</span>
                  </div>
                  <span className="text-sm text-[#8BC34A]">98%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
