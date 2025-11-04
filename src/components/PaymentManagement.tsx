import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  CreditCard,
  Smartphone,
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

// Mock payment data
const mockPayments = [
  {
    id: 'pay1',
    userId: 'm1',
    userName: 'Jean Baptiste Mugabo',
    cooperativeId: 'coop1',
    type: 'contribution',
    amount: 50000,
    currency: 'RWF',
    paymentMethod: 'mobile_money',
    mobileMoneyProvider: 'MTN',
    phoneNumber: '+250788234567',
    reference: 'CON-20251015-001',
    status: 'completed',
    description: 'Monthly membership contribution',
    initiatedDate: '2025-10-15T10:30:00',
    completedDate: '2025-10-15T10:31:15',
  },
  {
    id: 'pay2',
    userId: 'm2',
    userName: 'Alice Mukamana',
    cooperativeId: 'coop1',
    type: 'share_purchase',
    amount: 100000,
    currency: 'RWF',
    paymentMethod: 'bank_transfer',
    reference: 'SHR-20251014-002',
    status: 'completed',
    description: 'Purchase of 2 additional shares',
    initiatedDate: '2025-10-14T14:20:00',
    completedDate: '2025-10-14T16:45:30',
  },
  {
    id: 'pay3',
    userId: 'm3',
    userName: 'Patrick Habimana',
    cooperativeId: 'coop1',
    type: 'contribution',
    amount: 45000,
    currency: 'RWF',
    paymentMethod: 'mobile_money',
    mobileMoneyProvider: 'Airtel',
    phoneNumber: '+250733456789',
    reference: 'CON-20251013-003',
    status: 'processing',
    description: 'Monthly membership contribution',
    initiatedDate: '2025-10-13T09:15:00',
  },
  {
    id: 'pay4',
    userId: 'buyer1',
    userName: 'David Nkurunziza',
    cooperativeId: 'coop1',
    type: 'product_payment',
    amount: 600000,
    currency: 'RWF',
    paymentMethod: 'bank_transfer',
    reference: 'PRD-20251012-004',
    status: 'failed',
    description: 'Payment for 50kg coffee beans',
    initiatedDate: '2025-10-12T11:00:00',
  },
];

export function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#8BC34A]/10 text-[#8BC34A]';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      case 'cash':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const totalPayments = filteredPayments.length;
  const completedPayments = filteredPayments.filter(p => p.status === 'completed').length;
  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      title: 'Total Payments',
      value: totalPayments,
      icon: DollarSign,
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Completed',
      value: completedPayments,
      icon: CheckCircle,
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
    {
      title: 'Total Amount',
      value: `${(totalAmount / 1000000).toFixed(1)}M RWF`,
      icon: TrendingUp,
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>Monitor and manage all payment transactions</CardDescription>
            </div>
            <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Payments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or reference..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="contribution">Contribution</SelectItem>
                  <SelectItem value="share_purchase">Share Purchase</SelectItem>
                  <SelectItem value="product_payment">Product Payment</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm">{payment.userName}</p>
                        <p className="text-xs text-muted-foreground">{payment.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#8BC34A]">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <div>
                          <p className="text-sm capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </p>
                          {payment.mobileMoneyProvider && (
                            <p className="text-xs text-muted-foreground">
                              {payment.mobileMoneyProvider}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(payment.initiatedDate).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(payment.initiatedDate).toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {payment.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments found</p>
              <p className="text-sm text-muted-foreground">Adjust your filters to see more results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}