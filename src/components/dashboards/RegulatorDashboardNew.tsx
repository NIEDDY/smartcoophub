import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  DollarSign,
  FileText,
  Eye,
  Lock,
} from 'lucide-react';

export function RegulatorDashboardNew() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const regulatorStats = {
    totalCooperatives: 45,
    activeCooperatives: 38,
    pendingCompliance: 4,
    flaggedIssues: 2,
    totalMembers: 324,
    avgComplianceScore: 82,
  };

  const cooperativesList = [
    {
      id: 1,
      name: 'Kigali Coffee Coop',
      registrationDate: '2022-03-15',
      status: 'active',
      members: 45,
      complianceScore: 95,
      lastAudit: '2024-10-15',
    },
    {
      id: 2,
      name: 'Valley Dairy Coop',
      registrationDate: '2021-08-20',
      status: 'active',
      members: 32,
      complianceScore: 88,
      lastAudit: '2024-09-20',
    },
    {
      id: 3,
      name: 'Kigali Artisans',
      registrationDate: '2023-01-10',
      status: 'active',
      members: 28,
      complianceScore: 75,
      lastAudit: '2024-08-15',
    },
  ];

  const complianceReports = [
    {
      id: 1,
      cooperative: 'Kigali Coffee Coop',
      period: 'Q3 2024',
      financialReview: 'Compliant',
      documentationReview: 'Compliant',
      membershipReview: 'Compliant',
      overallScore: 95,
    },
    {
      id: 2,
      cooperative: 'Valley Dairy Coop',
      period: 'Q3 2024',
      financialReview: 'Compliant',
      documentationReview: 'Minor Issues',
      membershipReview: 'Compliant',
      overallScore: 88,
    },
    {
      id: 3,
      cooperative: 'Kigali Artisans',
      period: 'Q3 2024',
      financialReview: 'Minor Issues',
      documentationReview: 'Minor Issues',
      membershipReview: 'Compliant',
      overallScore: 75,
    },
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Financial Report Reviewed',
      cooperative: 'Kigali Coffee Coop',
      date: '2024-10-28',
      notes: 'Q3 financial statements reviewed and approved',
    },
    {
      id: 2,
      action: 'Membership Audit',
      cooperative: 'Valley Dairy Coop',
      date: '2024-10-25',
      notes: 'Annual membership verification completed',
    },
    {
      id: 3,
      action: 'Document Verification',
      cooperative: 'Kigali Artisans',
      date: '2024-10-22',
      notes: 'Constitution and bylaws update received',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending Review</Badge>;
      case 'suspended':
        return <Badge className="bg-red-600">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getComplianceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-blue-600">Good</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-600">Fair</Badge>;
    return <Badge className="bg-red-600">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Regulator Dashboard</h1>
        <p className="text-muted-foreground mt-2 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          RCA Monitoring & Compliance Review (Read-Only Access)
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cooperatives</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regulatorStats.totalCooperatives}</div>
            <p className="text-xs text-muted-foreground">
              {regulatorStats.activeCooperatives} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regulatorStats.pendingCompliance}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regulatorStats.flaggedIssues}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regulatorStats.avgComplianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              Platform average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cooperatives">Cooperatives</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm font-medium text-green-900">Fully Compliant</span>
                  <span className="text-2xl font-bold text-green-600">32</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm font-medium text-yellow-900">Minor Issues</span>
                  <span className="text-2xl font-bold text-yellow-600">10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm font-medium text-red-900">Critical Issues</span>
                  <span className="text-2xl font-bold text-red-600">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Access & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Access</CardTitle>
                <CardDescription>This is a read-only monitoring dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">View all cooperative data</span>
                </div>
                <div className="flex items-center gap-2 p-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Access compliance reports</span>
                </div>
                <div className="flex items-center gap-2 p-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Review audit trails</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">No modification rights</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cooperatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Cooperatives</CardTitle>
              <CardDescription>All cooperatives registered on the platform (monitored for compliance)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cooperativesList.map((coop) => (
                  <div key={coop.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium">{coop.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered: {coop.registrationDate}
                        </p>
                      </div>
                      {getStatusBadge(coop.status)}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-medium">{coop.members}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Compliance</p>
                        <div className="flex items-center gap-1">
                          {getComplianceBadge(coop.complianceScore)}
                          <span className="font-medium">{coop.complianceScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Audit</p>
                        <p className="font-medium">{coop.lastAudit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">View Details</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Quarterly compliance review summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{report.cooperative}</p>
                        <p className="text-sm text-muted-foreground">{report.period}</p>
                      </div>
                      {getComplianceBadge(report.overallScore)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Financial Review</p>
                        <Badge variant="outline" className={report.financialReview === 'Compliant' ? 'bg-green-50' : 'bg-yellow-50'}>
                          {report.financialReview}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documentation</p>
                        <Badge variant="outline" className={report.documentationReview === 'Compliant' ? 'bg-green-50' : 'bg-yellow-50'}>
                          {report.documentationReview}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Membership</p>
                        <Badge variant="outline" className={report.membershipReview === 'Compliant' ? 'bg-green-50' : 'bg-yellow-50'}>
                          {report.membershipReview}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Overall Score: {report.overallScore}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete monitoring and compliance check history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="p-4 border-l-4 border-l-blue-600 bg-muted/30 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{entry.cooperative}</p>
                    <p className="text-sm">{entry.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
