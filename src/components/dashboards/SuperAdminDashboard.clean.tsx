import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, Users, DollarSign, ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { cooperativeService } from '../../lib/services/cooperative.service';

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.log('Cooperatives loaded:', coopsData);
      } catch (error) {
        console.error('Error fetching cooperatives:', error);
        setCooperatives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCooperatives();
  }, []);

  // Calculate stats
  const totalCooperatives = cooperatives.length;
  const approvedCount = cooperatives.filter(c => c.status?.toUpperCase() === 'APPROVED').length;
  const pendingCount = cooperatives.filter(c => c.status?.toUpperCase() === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Administration</h2>
          <p className="text-muted-foreground">Monitor and manage all cooperatives</p>
        </div>
        {pendingCount > 0 && (
          <Button variant="outline" onClick={() => navigate('/approvals')}>
            <Clock className="h-4 w-4 mr-2" />
            {pendingCount} Pending Approval
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Cooperatives</CardTitle>
            <Building2 className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCooperatives}</div>
            <p className="text-xs text-muted-foreground">{approvedCount} approved, {pendingCount} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#8BC34A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Active cooperatives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">System users</p>
          </CardContent>
        </Card>
      </div>

      {/* Cooperatives List */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Cooperatives</CardTitle>
          <CardDescription>All cooperatives on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : cooperatives.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cooperatives registered yet
            </div>
          ) : (
            <div className="space-y-4">
              {cooperatives.map((coop) => (
                <div key={coop.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{coop.name}</h3>
                      {coop.status?.toUpperCase() === 'APPROVED' && (
                        <CheckCircle className="h-4 w-4 text-[#8BC34A]" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{coop.type} • {coop.address}</p>
                    <p className="text-sm text-muted-foreground">{coop.totalMembers || 0} members • {coop.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={coop.status?.toUpperCase() === 'APPROVED' ? 'default' : 'secondary'}>
                      {coop.status || 'PENDING'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => navigate('/approvals')}>
                      {coop.status?.toUpperCase() === 'PENDING' ? 'Approve' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
