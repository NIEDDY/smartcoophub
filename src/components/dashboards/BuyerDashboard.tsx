import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockProducts, mockOrders, mockCooperatives, mockProductReviews, mockFavoriteProducts } from '../../lib/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Star,
  MapPin,
  ArrowRight,
  Heart,
  Truck,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { ImageWithFallback } from '../Fallback/ImageWithFallback';
import { toast } from 'sonner';
import { PaymentDialog } from '../PaymentDialog';

const productImages: { [key: string]: string } = {
  'coffee-beans': 'https://images.unsplash.com/photo-1663125365404-e274869480f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  'coffee-ground': 'https://images.unsplash.com/photo-1583675655650-14f3b111164d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  'milk': 'https://images.unsplash.com/photo-1719532520242-a809140b313d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  'basket': 'https://images.unsplash.com/photo-1707671843744-ae47b02c2ddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
};

export function BuyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openReview, setOpenReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openPayment, setOpenPayment] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
  });

  const myOrders = mockOrders.filter(o => o.buyerId === user?.id);
  const totalSpent = myOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
  const completedOrders = myOrders.filter(o => o.status === 'delivered').length;
  const myFavorites = mockFavoriteProducts.filter(f => f.buyerId === user?.id);
  const myReviews = mockProductReviews.filter(r => r.buyerId === user?.id);

  const stats = [
    {
      title: 'My Orders',
      value: myOrders.length,
      description: 'Total orders placed',
      color: 'text-[#0288D1]',
      bgColor: 'bg-[#0288D1]/10',
      icon: ShoppingCart,
    },
    {
      title: 'Total Spent',
      value: `${(totalSpent / 1000).toFixed(0)}K`,
      description: 'RWF spent',
      color: 'text-[#8BC34A]',
      bgColor: 'bg-[#8BC34A]/10',
      icon: TrendingUp,
    },
    {
      title: 'Pending',
      value: pendingOrders,
      description: 'Awaiting delivery',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: Clock,
    },
    {
      title: 'Favorites',
      value: myFavorites.length,
      description: 'Saved products',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: Heart,
    },
  ];

  const handleAddToFavorites = (productId: string, productName: string) => {
    toast.success(`${productName} added to favorites`);
  };

  const handleRemoveFromFavorites = (productId: string, productName: string) => {
    toast.error(`${productName} removed from favorites`);
  };

  const handlePlaceOrder = (product: any, quantity: number) => {
    const total = product.price * quantity;
    setOrderDetails({
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice: total,
    });
    setOpenPayment(true);
  };

  const handleSubmitReview = () => {
    if (!review.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    toast.success('Review submitted successfully!');
    setOpenReview(false);
    setReview({ rating: 5, comment: '' });
    setSelectedProduct(null);
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-[#8BC34A]" />;
      case 'confirmed':
        return <Truck className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getProductRating = (productId: string) => {
    const reviews = mockProductReviews.filter(r => r.productId === productId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#8BC34A]/10 to-[#0288D1]/10 rounded-lg p-6">
        <h2>Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          Discover quality products from Rwanda's cooperatives
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
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className={selectedCategory === cat ? "bg-[#0288D1]" : ""}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Products Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const cooperative = mockCooperatives.find(c => c.id === product.cooperativeId);
              const rating = getProductRating(product.id);
              const isFavorite = myFavorites.some(f => f.productId === product.id);
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <ImageWithFallback
                      src={productImages[product.images[0]] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => isFavorite 
                        ? handleRemoveFromFavorites(product.id, product.name)
                        : handleAddToFavorites(product.id, product.name)
                      }
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Badge className="absolute bottom-2 left-2 bg-white/90">
                      {product.status === 'available' ? (
                        <CheckCircle className="h-3 w-3 mr-1 text-[#8BC34A]" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1 text-yellow-600" />
                      )}
                      {product.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {product.location}
                        </CardDescription>
                      </div>
                      {rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">By {cooperative?.name}</p>
                        <p className="text-xl text-[#8BC34A]">
                          {product.price.toLocaleString()} RWF
                          <span className="text-sm text-muted-foreground">/{product.unit}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-[#0288D1] hover:bg-[#0277BD]"
                        onClick={() => handlePlaceOrder(product, product.minOrder)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/marketplace')}
                      >
                        Details
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Min. order: {product.minOrder} {product.unit}(s) • Stock: {product.availableStock}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track your orders and delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              {myOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    You haven't placed any orders yet
                  </p>
                  <Button 
                    className="mt-4 bg-[#0288D1] hover:bg-[#0277BD]"
                    onClick={() => navigate('/marketplace')}
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm">{order.productName}</p>
                            {getOrderStatusIcon(order.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {order.cooperativeName}
                          </p>
                          <p className="text-sm mt-2">
                            Quantity: {order.quantity} • Total: {order.totalPrice.toLocaleString()} RWF
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ordered: {order.orderDate}
                            {order.deliveryDate && ` • Delivered: ${order.deliveryDate}`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={
                            order.status === 'delivered' 
                              ? 'bg-[#8BC34A]/10 text-[#8BC34A]'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {order.status}
                          </Badge>
                          <Badge className={
                            order.paymentStatus === 'paid'
                              ? 'bg-[#8BC34A]/10 text-[#8BC34A]'
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      {order.status === 'delivered' && !myReviews.some(r => r.orderId === order.id) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct({ id: order.productId, name: order.productName });
                            setOpenReview(true);
                          }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Write Review
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Products</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {myFavorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No favorite products yet
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myFavorites.map((fav) => {
                    const product = mockProducts.find(p => p.id === fav.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={fav.id} className="border rounded-lg p-4 flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded flex-shrink-0">
                          <ImageWithFallback
                            src={productImages[product.images[0]] || ''}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.cooperativeName}</p>
                          <p className="text-sm text-[#8BC34A] mt-1">
                            {product.price.toLocaleString()} RWF/{product.unit}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              className="bg-[#0288D1] hover:bg-[#0277BD]"
                              onClick={() => handlePlaceOrder(product, product.minOrder)}
                            >
                              Order
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRemoveFromFavorites(product.id, product.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>
                Reviews for verified purchases only (No fake reviews allowed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    You haven't written any reviews yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((review) => {
                    const product = mockProducts.find(p => p.id === review.productId);
                    const cooperative = mockCooperatives.find(c => c.id === review.cooperativeId);
                    
                    return (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm">{product?.name}</p>
                            <p className="text-xs text-muted-foreground">{cooperative?.name}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.reviewDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>Review Integrity:</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Only verified buyers can leave reviews</li>
                  <li>Reviews are linked to actual orders and purchases</li>
                  <li>Cooperatives cannot edit or delete buyer feedback</li>
                  <li>All reviews are public and contribute to cooperative ratings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={openReview} onOpenChange={setOpenReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReview({ ...review, rating })}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        rating <= review.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-comment">Your Review *</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell us about your experience..."
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpenReview(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              className="bg-[#0288D1] hover:bg-[#0277BD]"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={openPayment}
        onOpenChange={setOpenPayment}
        paymentType="product_payment"
        description={orderDetails ? `Order: ${orderDetails.productName} (${orderDetails.quantity} units)` : ''}
        amount={orderDetails?.totalPrice}
        onPaymentComplete={() => {
          toast.success('Order placed successfully!');
          setOrderDetails(null);
        }}
      />
    </div>
  );
}
