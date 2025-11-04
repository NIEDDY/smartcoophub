import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, DollarSign, Package, TrendingUp, FileText, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockCooperatives, mockMembers, mockTransactions, mockProducts, mockOrders, mockAnnouncements } from '../lib/mockData';
import { Progress } from './ui/progress';

export function Dashboard() {
  const { user } = useAuth();
  
  // Calculate stats based on user's cooperative
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
      description: 'Active cooperative members',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Total Income',
      value: `${(totalIncome / 1000000).toFixed(1)}M RWF`,
      icon: DollarSign,
      description: 'This month',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
    {
      title: 'Products',
      value: products.length,
      icon: Package,
      description: 'Listed on marketplace',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
    },
    {
      title: 'Net Profit',
      value: `${((totalIncome - totalExpenses) / 1000000).toFixed(1)}M RWF`,
      icon: TrendingUp,
      description: 'This month',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2>Welcome back, {user?.name}</h2>
        <p className="text-gray-600">
          {cooperative?.name} - {cooperative?.location}
        </p>
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
              <p className="text-xs text-gray-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className={`text-sm ${
                    transaction.type === 'income' ? 'text-green-600' : 
                    transaction.type === 'expense' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {(transaction.amount / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Members by contribution amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members
                .sort((a, b) => b.contributions - a.contributions)
                .slice(0, 5)
                .map((member) => {
                  const maxContribution = Math.max(...members.map(m => m.contributions));
                  const percentage = (member.contributions / maxContribution) * 100;
                  
                  return (
                    <div key={member.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{member.name}</span>
                        <span className="text-gray-600">{(member.contributions / 1000).toFixed(0)}K RWF</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Active Announcements</CardTitle>
          <CardDescription>Latest opportunities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAnnouncements
              .filter(a => a.status === 'active')
              .slice(0, 3)
              .map((announcement) => (
                <div key={announcement.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                  <div className="bg-blue-50 p-2 rounded">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm">{announcement.title}</p>
                        <p className="text-xs text-gray-600">{announcement.cooperativeName}</p>
                      </div>
                      <span className="text-xs bg-[#0288D1]/10 text-[#0288D1] px-2 py-1 rounded">
                        {announcement.type}
                      </span>
                    </div>
                    {announcement.deadline && (
                      <p className="text-xs text-gray-500 mt-1">Deadline: {announcement.deadline}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
