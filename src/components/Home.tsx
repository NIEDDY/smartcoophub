import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockProducts, mockAnnouncements, mockCooperatives } from '../lib/mockData';
import { ArrowRight, TrendingUp, Users, Package, Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';
import { ImageWithFallback } from './Fallback/ImageWithFallback';

const productImages: { [key: string]: string } = {
  'coffee-beans': 'https://images.unsplash.com/photo-1663125365404-e274869480f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGZhcm18ZW58MXx8fHwxNzYwNDI2ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'coffee-ground': 'https://images.unsplash.com/photo-1583675655650-14f3b111164d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwY29mZmVlJTIwZ3JvdW5kfGVufDF8fHx8MTc2MDQyNjgyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'milk': 'https://images.unsplash.com/photo-1719532520242-a809140b313d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBmcmVzaHxlbnwxfHx8fDE3NjAzNTAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'basket': 'https://images.unsplash.com/photo-1707671843744-ae47b02c2ddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYmFza2V0JTIwaGFuZGljcmFmdHxlbnwxfHx8fDE3NjA0MjY4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

interface HomeProps {
  onNavigate: (view: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const featuredProducts = mockProducts.slice(0, 6);
  const recentAnnouncements = mockAnnouncements.filter(a => a.status === 'active').slice(0, 4);
  
  const totalCooperatives = mockCooperatives.length;
  const totalMembers = mockCooperatives.reduce((sum, coop) => sum + coop.memberCount, 0);
  const totalProducts = mockProducts.length;

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'job':
        return Briefcase;
      case 'training':
        return Users;
      case 'meeting':
        return Calendar;
      default:
        return Briefcase;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'job':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'training':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'meeting':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'tender':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#8BC34A] via-[#0288D1] to-[#7CB342] text-white p-8 lg:p-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl mb-4">
            Empowering Rwandan Cooperatives Through Digital Innovation
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Connect with cooperatives, discover quality products, and explore opportunities across Rwanda. 
            Join us in building a transparent and efficient cooperative ecosystem powered by blockchain technology.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              className="bg-white text-[#0288D1] hover:bg-white/90"
              onClick={() => onNavigate('marketplace')}
            >
              Explore Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => onNavigate('announcements')}
            >
              View Opportunities
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
      </section>

      {/* Stats Section */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-[#0288D1]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Cooperatives</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalCooperatives}</div>
            <p className="text-xs text-muted-foreground">Across Rwanda</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#8BC34A]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Members</CardTitle>
            <Users className="h-4 w-4 text-[#8BC34A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#0288D1]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Available Products</CardTitle>
            <Package className="h-4 w-4 text-[#0288D1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">On marketplace</p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Featured Products</h2>
            <p className="text-muted-foreground">Quality products from Rwandan cooperatives</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('marketplace')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <ImageWithFallback
                  src={productImages[product.images[0]] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Available
                  </Badge>
                </div>
                <CardDescription className="text-sm">{product.cooperativeName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg">{product.price.toLocaleString()} RWF</span>
                    <span className="text-sm text-muted-foreground">/{product.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.location.split(',')[0]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Announcements */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Latest Opportunities</h2>
            <p className="text-muted-foreground">Jobs, training, and cooperative updates</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('announcements')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recentAnnouncements.map((announcement) => {
            const Icon = getAnnouncementIcon(announcement.type);
            return (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeBadgeColor(announcement.type).replace('text', 'bg').replace(/100|900/, '50')}`}>
                      <Icon className={`h-5 w-5 ${getTypeBadgeColor(announcement.type).split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
                        <Badge className={getTypeBadgeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <CardDescription>{announcement.cooperativeName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {announcement.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {announcement.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{announcement.location}</span>
                      </div>
                    )}
                    {announcement.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Deadline: {announcement.deadline}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-[#8BC34A]/10 to-[#0288D1]/10 dark:from-[#8BC34A]/5 dark:to-[#0288D1]/5 rounded-2xl p-8 lg:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4">What We Do</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The Smart Cooperative Hub digitizes cooperative management, connects producers with buyers, 
            and promotes transparency through blockchain technology. We support agricultural and artisan 
            cooperatives across Rwanda in their journey towards digital transformation and sustainable growth.
          </p>
          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#0288D1] rounded-lg flex items-center justify-center mb-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h4>Digital Management</h4>
              <p className="text-sm text-muted-foreground">
                Streamline cooperative operations with digital tools for members, finances, and reporting.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-3">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h4>Market Access</h4>
              <p className="text-sm text-muted-foreground">
                Connect cooperatives with buyers through our digital marketplace platform.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8BC34A] to-[#0288D1] rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h4>Transparency</h4>
              <p className="text-sm text-muted-foreground">
                Blockchain-powered verification for transactions and accountability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
