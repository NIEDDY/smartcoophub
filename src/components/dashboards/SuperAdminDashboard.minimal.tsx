import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, Users, DollarSign, ShoppingCart } from 'lucide-react';

export function SuperAdminDashboardMinimal() {
  const [loading, setLoading] = useState(false);
  const [cooperatives, setCooperatives] = useState<any[]>([]);

  useEffect(() => {
    // Just show something immediately
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">System Administration</h2>
        <p className="text-muted-foreground mt-1">
          Monitor and manage the entire Smart Cooperative Hub platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Cooperatives</CardTitle>
            <Building2 className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">0</div>
            <p className="text-xs text-muted-foreground">0 active, 0 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#8BC34A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">0</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">0.0M RWF</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#8BC34A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">0</div>
            <p className="text-xs text-muted-foreground">0 delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to System Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>System is ready. No cooperatives registered yet.</p>
          <Button className="bg-[#0288D1] hover:bg-[#0277BD]">
            Register New Cooperative
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
