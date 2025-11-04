import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Package, 
  Phone, 
  Mail,
  Building2,
  ShoppingCart,
  Star,
  Filter,
  ChevronDown
} from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { mockProducts } from '../lib/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function PublicProductsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const categories = ['all', 'coffee', 'dairy', 'handicrafts', 'tea', 'honey'];
  const districts = ['all', 'Kigali', 'Huye', 'Musanze', 'Nyagatare', 'Rubavu'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || product.location.includes(selectedDistrict);
    return matchesSearch && matchesCategory && matchesDistrict && product.status === 'available';
  });

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-border bg-background/95 backdrop-blur-sm shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Smart Cooperative Hub" className="h-12 sm:h-14" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2 hidden sm:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="sm:hidden p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate('/signin')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">Discover Quality Products</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
            Browse products from registered cooperatives across Rwanda. Connect directly with producers for the best quality and prices.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 sm:h-12"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 sm:h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 sm:h-12">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district === 'all' ? 'All Locations' : district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-2 hover:border-[#0288D1]/50 transition-all hover:shadow-xl cursor-pointer overflow-hidden group"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-[#8BC34A]/20 to-[#0288D1]/20 flex items-center justify-center overflow-hidden">
                  <Package className="h-12 w-12 sm:h-16 sm:w-16 text-[#0288D1]/40 group-hover:scale-110 transition-transform" />
                </div>
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base line-clamp-1 leading-tight">{product.name}</CardTitle>
                    <Badge className="bg-[#8BC34A]/10 text-[#8BC34A] shrink-0 text-xs">
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{product.cooperativeName}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                  <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm sm:text-base font-medium">{product.price.toLocaleString()} RWF</p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg sm:text-xl mb-2">No products found</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-[#8BC34A] to-[#0288D1] rounded-2xl text-white text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">Want to Sell Your Products?</h2>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our platform to reach thousands of buyers across Rwanda and beyond
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signin')}
            className="bg-white text-[#0288D1] hover:bg-white/90"
          >
            Register Your Cooperative
          </Button>
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Product details from {selectedProduct?.cooperativeName}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Image */}
              <div className="aspect-video bg-gradient-to-br from-[#8BC34A]/20 to-[#0288D1]/20 rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 sm:h-32 sm:w-32 text-[#0288D1]/40" />
              </div>

              {/* Price and Status */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-medium">{selectedProduct.price.toLocaleString()} RWF</p>
                  <p className="text-sm sm:text-base text-muted-foreground">per {selectedProduct.unit}</p>
                </div>
                <Badge className="bg-[#8BC34A]/10 text-[#8BC34A] text-sm sm:text-base px-3 py-1">
                  {selectedProduct.status}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg mb-2">Description</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{selectedProduct.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base">Category</h4>
                  <p className="text-sm sm:text-base text-muted-foreground capitalize">{selectedProduct.category}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base">Quantity Available</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">{selectedProduct.quantity} {selectedProduct.unit}s</p>
                </div>
              </div>

              {/* Cooperative Info */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-base sm:text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Cooperative Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base">{selectedProduct.cooperativeName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base">{selectedProduct.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm sm:text-base">+250 788 XXX XXX</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
                  onClick={() => {
                    navigate('/signin');
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Sign In to Purchase
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    window.location.href = 'tel:+250788000000';
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                Sign in or create an account to place orders and contact sellers directly
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
