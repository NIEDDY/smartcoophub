import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts, mockOrders, mockCooperatives } from '../lib/mockData';
import { Package, Plus, Search, ShoppingCart, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './Fallback/ImageWithFallback';
import { CooperativeStatusGuard } from './CooperativeStatusGuard';

const productImages: { [key: string]: string } = {
  'coffee-beans': 'https://images.unsplash.com/photo-1663125365404-e274869480f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGZhcm18ZW58MXx8fHwxNzYwNDI2ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'coffee-ground': 'https://images.unsplash.com/photo-1583675655650-14f3b111164d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwY29mZmVlJTIwZ3JvdW5kfGVufDF8fHx8MTc2MDQyNjgyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'milk': 'https://images.unsplash.com/photo-1719532520242-a809140b313d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBmcmVzaHxlbnwxfHx8fDE3NjAzNTAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'basket': 'https://images.unsplash.com/photo-1707671843744-ae47b02c2ddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYmFza2V0JTIwaGFuZGljcmFmdHxlbnwxfHx8fDE3NjA0MjY4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

export function Marketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get user's cooperative status if they are a cooperative admin
  const userCooperative = user?.cooperativeId 
    ? mockCooperatives.find(c => c.id === user.cooperativeId)
    : null;

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Only show products from approved cooperatives
    const productCooperative = mockCooperatives.find(c => c.id === product.cooperativeId);
    const cooperativeApproved = productCooperative?.status?.toUpperCase() === 'APPROVED';
    
    return matchesSearch && matchesCategory && cooperativeApproved;
  });

  const userProducts = user?.cooperativeId 
    ? mockProducts.filter(p => p.cooperativeId === user.cooperativeId)
    : [];

  const userOrders = mockOrders.filter(o => 
    user?.role === 'buyer' ? o.buyerId === user.id : o.cooperativeId === user?.cooperativeId
  );

  const handleAddProduct = () => {
    toast.success('Product added to marketplace successfully!');
  };

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully! The cooperative will contact you soon.');
  };

  const categories = ['all', 'coffee', 'dairy', 'handicrafts'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Marketplace</h2>
          <p className="text-gray-600">Browse and sell cooperative products</p>
        </div>
        {(user?.role === 'COOP_ADMIN') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={userCooperative?.status?.toUpperCase() !== 'APPROVED'}>
                <Plus className="h-4 w-4 mr-2" />
                List Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>List New Product</DialogTitle>
                <DialogDescription>Add a product to the marketplace</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input id="product-name" placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="handicrafts">Handicrafts</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Product description" rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (RWF)</Label>
                    <Input id="price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" placeholder="kg, liter, piece" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Available Stock</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                </div>
                <Button onClick={handleAddProduct}>List Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">
            <Package className="h-4 w-4 mr-2" />
            Browse Products
          </TabsTrigger>
          {(user?.role === 'COOP_ADMIN' || user?.role === 'MEMBER') && (
            <TabsTrigger value="my-products">My Products</TabsTrigger>
          )}
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
        </TabsList>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="handicrafts">Handicrafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={productImages[product.images[0]] || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm leading-tight">{product.name}</CardTitle>
                        <Badge className={product.status === 'available' ? 'bg-green-100 text-green-700 text-xs' : 'bg-gray-100 text-gray-700 text-xs'}>
                          {product.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{product.cooperativeName}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">{product.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Price:</span>
                          <span className="text-sm font-medium">{product.price.toLocaleString()} RWF/{product.unit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Available:</span>
                          <span className="text-xs">{product.availableStock} {product.unit}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{product.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full text-xs py-1 h-8" disabled={product.status !== 'available'}>
                            Place Order
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Place Order</DialogTitle>
                            <DialogDescription>{product.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="quantity">Quantity ({product.unit})</Label>
                              <Input id="quantity" type="number" min={product.minOrder} placeholder={`Min: ${product.minOrder}`} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="buyer-name">Your Name</Label>
                              <Input id="buyer-name" placeholder="Full name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="buyer-phone">Phone Number</Label>
                              <Input id="buyer-phone" placeholder="+250 788 000 000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="payment-method">Payment Method</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="momo">Mobile Money</SelectItem>
                                  <SelectItem value="bank">Bank Transfer</SelectItem>
                                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button className="w-full" onClick={handlePlaceOrder}>Confirm Order</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Products Tab */}
        <TabsContent value="my-products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Listed Products</CardTitle>
              <CardDescription>Products from your cooperative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 border rounded-lg p-4">
                    <div className="w-24 h-24 rounded overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={productImages[product.images[0]] || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4>{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">{product.price.toLocaleString()} RWF/{product.unit}</span>
                        <span className="text-sm text-gray-600">Stock: {product.availableStock}</span>
                        <Badge className={product.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {user?.role === 'buyer' ? 'My Orders' : 'Received Orders'}
              </CardTitle>
              <CardDescription>
                {user?.role === 'buyer' ? 'Track your purchases' : 'Manage customer orders'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4>{order.productName}</h4>
                        <p className="text-sm text-gray-600">{order.cooperativeName}</p>
                      </div>
                      <Badge className={
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity:</span> {order.quantity}
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span> {order.totalPrice.toLocaleString()} RWF
                      </div>
                      <div>
                        <span className="text-gray-600">Payment:</span> {order.paymentMethod}
                      </div>
                      <div>
                        <span className="text-gray-600">Order Date:</span> {order.orderDate}
                      </div>
                      {user?.role !== 'buyer' && (
                        <>
                          <div>
                            <span className="text-gray-600">Buyer:</span> {order.buyerName}
                          </div>
                          <div>
                            <span className="text-gray-600">Contact:</span> {order.buyerPhone}
                          </div>
                        </>
                      )}
                    </div>
                    {user?.role !== 'buyer' && order.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => toast.success('Order confirmed!')}>Confirm</Button>
                        <Button size="sm" variant="outline" onClick={() => toast.info('Order cancelled')}>Cancel</Button>
                      </div>
                    )}
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
