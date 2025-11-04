import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  ShoppingCart,
  MapPin,
  Star,
  TrendingUp,
  Heart,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  PhoneCall,
  Building2,
} from 'lucide-react';

export function BuyerDashboardNew() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Mock data
  const buyerStats = {
    totalOrders: 24,
    pendingOrders: 3,
    completedOrders: 20,
    totalSpent: 450000,
    favoriteCooperatives: 5,
  };

  const recentOrders = [
    {
      id: 1,
      orderId: 'ORD-2024-001',
      productName: 'Fresh Coffee Beans',
      cooperativeId: 1,
      cooperative: 'Kigali Coffee Coop',
      cooperativePhone: '+250788123456',
      cooperativeEmail: 'contact@kigalicoffee.com',
      cooperativeLocation: 'Kigali, Rwanda',
      quantity: 5,
      unit: 'kg',
      unitPrice: 5000,
      totalPrice: 25000,
      orderDate: '2024-10-28',
      status: 'pending',
      paymentStatus: 'pending',
      estimatedDelivery: '2024-11-05',
      shippingAddress: 'KG 123 St, Kigali',
      trackingNumber: 'TRACK-2024-001',
      description: 'Premium arabica coffee beans from Kigali region',
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      productName: 'Handwoven Baskets',
      cooperativeId: 3,
      cooperative: 'Kigali Artisans',
      cooperativePhone: '+250789654321',
      cooperativeEmail: 'info@kigaliartisans.com',
      cooperativeLocation: 'Kigali, Rwanda',
      quantity: 3,
      unit: 'pieces',
      unitPrice: 15000,
      totalPrice: 45000,
      orderDate: '2024-10-25',
      status: 'in_transit',
      paymentStatus: 'paid',
      estimatedDelivery: '2024-11-02',
      shippingAddress: 'KG 456 Ave, Kigali',
      trackingNumber: 'TRACK-2024-002',
      description: 'Handcrafted traditional baskets from local artisans',
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      productName: 'Fresh Dairy Products',
      cooperativeId: 2,
      cooperative: 'Valley Dairy Coop',
      cooperativePhone: '+250787654321',
      cooperativeEmail: 'orders@valleydairy.com',
      cooperativeLocation: 'Nyabihu, Rwanda',
      quantity: 10,
      unit: 'liters',
      unitPrice: 8000,
      totalPrice: 80000,
      orderDate: '2024-10-20',
      status: 'delivered',
      paymentStatus: 'paid',
      estimatedDelivery: '2024-10-23',
      actualDelivery: '2024-10-23',
      shippingAddress: 'KG 789 Blvd, Kigali',
      trackingNumber: 'TRACK-2024-003',
      description: 'Fresh pasteurized milk and yogurt products',
    },
    {
      id: 4,
      orderId: 'ORD-2024-004',
      productName: 'Organic Tea Leaves',
      cooperativeId: 1,
      cooperative: 'Kigali Coffee Coop',
      cooperativePhone: '+250788123456',
      cooperativeEmail: 'contact@kigalicoffee.com',
      cooperativeLocation: 'Kigali, Rwanda',
      quantity: 2,
      unit: 'kg',
      unitPrice: 12000,
      totalPrice: 24000,
      orderDate: '2024-10-18',
      status: 'delivered',
      paymentStatus: 'paid',
      estimatedDelivery: '2024-10-22',
      actualDelivery: '2024-10-22',
      shippingAddress: 'KG 321 Park, Kigali',
      trackingNumber: 'TRACK-2024-004',
      description: 'Premium organic tea leaves from highlands',
    },
  ];

  const topCooperatives = [
    {
      id: 1,
      name: 'Kigali Coffee Coop',
      rating: 4.8,
      reviews: 156,
      products: 12,
      location: 'Kigali, Rwanda',
    },
    {
      id: 2,
      name: 'Valley Dairy Coop',
      rating: 4.6,
      reviews: 98,
      products: 8,
      location: 'Nyabihu, Rwanda',
    },
    {
      id: 3,
      name: 'Kigali Artisans',
      rating: 4.7,
      reviews: 124,
      products: 25,
      location: 'Kigali, Rwanda',
    },
  ];

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-600">✓ Delivered</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-600"><Truck className="h-3 w-3 mr-1 inline" />In Transit</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600"><Clock className="h-3 w-3 mr-1 inline" />Pending Confirmation</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">✗ Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700">✓ Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">⏱ Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">✗ Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderProgress = (status: string) => {
    const stages = ['pending', 'in_transit', 'delivered'];
    return stages.indexOf(status);
  };

  const getEstimatedDaysRemaining = (estimatedDate: string) => {
    const today = new Date('2024-10-28');
    const delivery = new Date(estimatedDate);
    const daysRemaining = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
        <p className="text-muted-foreground mt-2">Browse, order, and track agricultural products</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {buyerStats.pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerStats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {(buyerStats.totalSpent / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyerStats.favoriteCooperatives}</div>
            <p className="text-xs text-muted-foreground">
              Saved cooperatives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="cooperatives">Top Cooperatives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Near Me
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.productName}</p>
                      <p className="text-xs text-muted-foreground">{order.cooperative}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-lg">{order.productName}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {order.cooperative}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Order ID: {order.orderId}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {expandedOrderId === order.id ? 'Hide' : 'View'} Details
                    </Button>
                  </div>
                </CardHeader>

                {/* Order Summary */}
                <CardContent className="pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Quantity</p>
                      <p className="font-semibold">{order.quantity} {order.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Unit Price</p>
                      <p className="font-semibold">RWF {order.unitPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total</p>
                      <p className="font-semibold text-lg">RWF {order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Payment</p>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>

                  {/* Order Timeline/Progress */}
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">ORDER STATUS</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
                        <span>Confirmed</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 ${order.status !== 'pending' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${order.status === 'in_transit' || order.status === 'delivered' ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                          {(order.status === 'in_transit' || order.status === 'delivered') && <Truck className="h-3 w-3 text-white" />}
                        </div>
                        <span className="mt-1">In Transit</span>
                      </div>
                      <div className={`flex-1 h-1 mx-2 ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${order.status === 'delivered' ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                          {order.status === 'delivered' && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className="mt-1">Delivered</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <>
                    <Separator />
                    <CardContent className="pt-4 space-y-4">
                      {/* Cooperative Contact Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Cooperative Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <PhoneCall className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">Phone</p>
                              <p className="font-medium">{order.cooperativePhone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">Email</p>
                              <p className="font-medium">{order.cooperativeEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">Location</p>
                              <p className="font-medium">{order.cooperativeLocation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Delivery Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Delivery Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Tracking Number</p>
                            <p className="font-mono font-semibold text-blue-600">{order.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Estimated Delivery</p>
                            <p className="font-medium">{order.estimatedDelivery}</p>
                            {order.status !== 'delivered' && (
                              <p className="text-xs text-green-600 mt-1">{getEstimatedDaysRemaining(order.estimatedDelivery)} days remaining</p>
                            )}
                          </div>
                          {order.actualDelivery && (
                            <div>
                              <p className="text-muted-foreground text-xs">Actual Delivery</p>
                              <p className="font-medium text-green-600">{order.actualDelivery}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground text-xs">Shipping Address</p>
                            <p className="font-medium">{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Product Details</h4>
                        <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                        <div className="bg-muted/30 p-3 rounded text-sm">
                          <p className="font-medium mb-2">Order Summary</p>
                          <div className="flex justify-between mb-1">
                            <span>Unit Price:</span>
                            <span>RWF {order.unitPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Quantity:</span>
                            <span>{order.quantity} {order.unit}</span>
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>RWF {order.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-2" />
                            Rate Order
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Cooperative
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cooperatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Cooperatives</CardTitle>
              <CardDescription>Discover quality suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCooperatives.map((coop) => (
                  <div key={coop.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium">{coop.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {coop.location}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={favorites.has(coop.id) ? 'default' : 'outline'}
                        onClick={() => toggleFavorite(coop.id)}
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(coop.id) ? '' : 'mr-2'}`} />
                        {!favorites.has(coop.id) && 'Save'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <p className="font-medium">{coop.rating}</p>
                          <p className="text-muted-foreground">({coop.reviews})</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Products</p>
                        <p className="font-medium mt-1">{coop.products} items</p>
                      </div>
                      <div className="text-right">
                        <Button size="sm" className="w-full">
                          Shop Now
                        </Button>
                      </div>
                    </div>
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
