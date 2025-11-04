import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  Globe, 
  Smartphone,
  BarChart3,
  FileText,
  Heart,
  Zap,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  X,
  Send,
  HelpCircle,
  Moon,
  Sun,
  Package
} from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { mockProducts, mockAnnouncements } from '../lib/mockData';

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  hideAuthButtons?: boolean;
}

// Animated Background Component
function AnimatedBackground() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1608377803145-1b14f44ee3c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBjb2ZmZWUlMjBmYXJtZXJzfGVufDF8fHx8MTc2MDQzNjAwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1708417134690-4ccf04c9ad73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tZW4lMjBmYXJtZXJzJTIwY29vcGVyYXRpdmV8ZW58MXx8fHwxNzYwNDM2MDA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1677128351571-0003c741ab25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjB0ZWElMjBwbGFudGF0aW9uJTIwd29ya2Vyc3xlbnwxfHx8fDE3NjA0MzYwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1744726014832-f2ba7f46ae16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYWdyaWN1bHR1cmUlMjBoYXJ2ZXN0fGVufDF8fHx8MTc2MDQzNjAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1551357176-67341c5b414f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBmYXJtaW5nJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2MDQzNjAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1615637765047-c156d0d78869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdmVnZXRhYmxlJTIwbWFya2V0JTIwZmFybWVyc3xlbnwxfHx8fDE3NjA0MzYwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-2000"
          style={{
            backgroundImage: `url(${image})`,
            opacity: currentImageIndex === index ? 1 : 0,
            transform: currentImageIndex === index ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      ))}
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/50 dark:from-background/70 dark:via-background/50 dark:to-background/60" />
    </div>
  );
}

export function LandingPage({ onGetStarted, onLogin, hideAuthButtons = false }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showAbout, setShowAbout] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hello! How can I help you today?", isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Track active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'home');
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { text: chatInput, isUser: true }];
    setChatMessages(newMessages);
    setChatInput('');

    // Simple bot responses
    setTimeout(() => {
      let botResponse = "I'm here to help! For detailed support, please contact us at support@smartcoophub.com";
      
      if (chatInput.toLowerCase().includes('register') || chatInput.toLowerCase().includes('signup')) {
        botResponse = "To register, click 'Get Started' and choose your account type: Cooperative or Buyer. Members receive invitations from their cooperative admin.";
      } else if (chatInput.toLowerCase().includes('member') && (chatInput.toLowerCase().includes('join') || chatInput.toLowerCase().includes('invitation'))) {
        botResponse = "Members cannot register directly. Your cooperative admin will send you an invitation code via email. Use that code to complete your registration.";
      } else if (chatInput.toLowerCase().includes('price') || chatInput.toLowerCase().includes('cost')) {
        botResponse = "Our platform offers flexible pricing plans. Contact us at info@smartcoophub.com for more details.";
      } else if (chatInput.toLowerCase().includes('support') || chatInput.toLowerCase().includes('help')) {
        botResponse = "You can reach our support team at support@smartcoophub.com or call +250 788 000 000";
      }
      
      setChatMessages([...newMessages, { text: botResponse, isUser: false }]);
    }, 1000);
  };

  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Easily manage cooperative members, roles, and contributions in one centralized system.',
      color: 'text-[#0288D1]',
      bg: 'bg-[#0288D1]/10'
    },
    {
      icon: BarChart3,
      title: 'Financial Tracking',
      description: 'Track income, expenses, and contributions with transparent blockchain verification.',
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/10'
    },
    {
      icon: ShoppingCart,
      title: 'Digital Marketplace',
      description: 'Connect with buyers and sell your products through our integrated marketplace platform.',
      color: 'text-[#0288D1]',
      bg: 'bg-[#0288D1]/10'
    },
    {
      icon: FileText,
      title: 'Automated Reports',
      description: 'Generate compliance reports for RCA and internal use with just one click.',
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/10'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All transactions are recorded on blockchain for maximum transparency and trust.',
      color: 'text-[#0288D1]',
      bg: 'bg-[#0288D1]/10'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your cooperative data anytime, anywhere from any device.',
      color: 'text-[#8BC34A]',
      bg: 'bg-[#8BC34A]/10'
    }
  ];

  const benefits = [
    'Increased transparency and accountability',
    'Better access to markets and buyers',
    'Simplified regulatory compliance',
    'Improved financial management',
    'Enhanced member engagement',
    'Real-time performance tracking'
  ];

  const stats = [
    { value: '500+', label: 'Active Cooperatives' },
    { value: '10K+', label: 'Registered Members' },
    { value: '50M+', label: 'RWF in Transactions' },
    { value: '100+', label: 'Products Listed' }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Smart Cooperative Hub" className="h-16" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-8">
                <a href="#home" className={`text-base hover:text-[#0288D1] transition-colors flex items-center gap-1 ${activeSection === 'home' ? 'font-medium' : 'font-normal'}`}>
                  Home
                </a>
                <button onClick={() => navigate('/products')} className="text-base hover:text-[#0288D1] transition-colors font-normal">
                  Products
                </button>
                <a href="#announcements" className={`text-base hover:text-[#0288D1] transition-colors ${activeSection === 'announcements' ? 'font-medium' : 'font-normal'}`}>
                  Opportunities
                </a>
                <a href="#features" className={`text-base hover:text-[#0288D1] transition-colors ${activeSection === 'features' ? 'font-medium' : 'font-normal'}`}>
                  Features
                </a>
                <a href="#contact" className={`text-base hover:text-[#0288D1] transition-colors ${activeSection === 'contact' ? 'font-medium' : 'font-normal'}`}>
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
              {!hideAuthButtons && (
                <Button onClick={() => navigate('/signin')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-24 pb-20 lg:pb-32 z-10">
        {/* Animated Background */}
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
              <Badge className="bg-[#8BC34A]/90 text-white border-[#8BC34A]/20 shadow-lg">
                Trusted by 500+ Cooperatives Across Rwanda
              </Badge>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold drop-shadow-lg">
                Empowering Rwandan Cooperatives Through
                <span className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] bg-clip-text text-transparent"> Digital Innovation</span>
              </h1>
              <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
                The Smart Cooperative Hub digitizes cooperative management, connects producers with buyers,
                and promotes transparency through blockchain technology. Join the digital transformation today.
              </p>
              {!hideAuthButtons && (
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate('/signin')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white shadow-xl hover:shadow-2xl">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#0288D1] border-2 border-background shadow-lg" />
                  ))}
                </div>
                <div>
                  <p className="text-sm drop-shadow-md">Trusted by cooperative leaders</p>
                  <div className="flex items-center gap-1 text-yellow-400 drop-shadow-md">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className="text-sm ml-1 drop-shadow-md">(4.9/5)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] rounded-2xl blur-3xl opacity-20" />
              <Card className="relative border-2 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-[#8BC34A]/20 to-[#0288D1]/20 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4 p-8 lg:p-12">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#8BC34A] to-[#0288D1] rounded-full flex items-center justify-center shadow-xl">
                        <Globe className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold drop-shadow-md">Digital Cooperative Management</h3>
                      <p className="text-base lg:text-lg drop-shadow-md">Transform your cooperative operations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,transparent,rgba(0,0,0,0.5))] pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl lg:text-5xl mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
            <Badge className="bg-[#0288D1]/90 text-white border-[#0288D1]/20 mb-4 shadow-lg">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
              Everything You Need to Manage Your Cooperative
            </h2>
            <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
              Comprehensive tools designed specifically for Rwandan cooperatives
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-[#0288D1]/50 transition-all hover:shadow-xl bg-background/90 shadow-lg h-full flex flex-col">
                <CardHeader className="flex-1">
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 shadow-md`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="drop-shadow-md">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base drop-shadow-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-background/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
            <Badge className="bg-[#8BC34A]/90 text-white border-[#8BC34A]/20 mb-4 shadow-lg">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
              Join thousands of cooperatives already using our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register Your Cooperative',
                description: 'Sign up and complete your cooperative profile with basic information',
                icon: Users
              },
              {
                step: '02',
                title: 'Add Members & Products',
                description: 'Invite members and list your products on the marketplace',
                icon: ShoppingCart
              },
              {
                step: '03',
                title: 'Start Growing',
                description: 'Track finances, connect with buyers, and access new opportunities',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] -z-10" />
                )}
                <Card className="relative border-2 bg-background/90 shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#0288D1] text-white flex items-center justify-center text-2xl mb-4">
                      {item.step}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
            <Badge className="bg-[#8BC34A]/90 text-white border-[#8BC34A]/20 mb-4 shadow-lg">
              Marketplace
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
              Featured Products from Our Cooperatives
            </h2>
            <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
              Discover quality products directly from registered cooperatives across Rwanda
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.slice(0, 6).map((product) => (
              <Card key={product.id} className="border-2 hover:border-[#0288D1]/50 transition-all hover:shadow-xl bg-background/90 shadow-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-[#8BC34A]/20 to-[#0288D1]/20 flex items-center justify-center">
                  <Package className="h-16 w-16 text-[#0288D1]/40" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">{product.status}</Badge>
                  </div>
                  <CardDescription className="text-xs">{product.cooperativeName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg">{product.price.toLocaleString()} RWF</p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/products')} className="bg-[#0288D1] hover:bg-[#0277BD]">
                      View Details
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate('/products')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white shadow-xl hover:shadow-2xl">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section id="announcements" className="py-20 lg:py-32 bg-background/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
            <Badge className="bg-[#0288D1]/90 text-white border-[#0288D1]/20 mb-4 shadow-lg">
              Opportunities
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
              Latest Announcements & Opportunities
            </h2>
            <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
              Job postings, training programs, and partnership opportunities from cooperatives
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockAnnouncements.filter(a => a.visibility === 'public').slice(0, 4).map((announcement) => (
              <Card key={announcement.id} className="border-2 hover:border-[#0288D1]/50 transition-all hover:shadow-xl bg-background/90 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={
                          announcement.type === 'job' ? 'bg-[#0288D1]/10 text-[#0288D1]' :
                          announcement.type === 'training' ? 'bg-[#8BC34A]/10 text-[#8BC34A]' :
                          announcement.type === 'tender' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {announcement.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {announcement.applicants} applicants
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{announcement.title}</CardTitle>
                      <CardDescription className="text-xs">{announcement.cooperativeName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{announcement.description}</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {announcement.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Deadline: {announcement.deadline}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate('/signin')} className="w-full bg-[#0288D1] hover:bg-[#0277BD]">
                    View Details & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => navigate('/signin')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white shadow-xl hover:shadow-2xl">
              View All Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 bg-background/95 dark:bg-background/95 p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl backdrop-blur-sm">
              <Badge className="bg-[#0288D1]/90 text-white border-[#0288D1]/20 shadow-lg">
                Benefits
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold drop-shadow-lg">
                Why Cooperatives Choose Our Platform
              </h2>
              <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
                Transform your cooperative with digital tools that drive growth, transparency, and success.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#8BC34A]/90 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-lg drop-shadow-md">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => navigate('/signin')} className="bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white shadow-xl hover:shadow-2xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, label: 'Member Satisfaction', value: '98%' },
                { icon: Zap, label: 'Faster Processing', value: '5x' },
                { icon: Shield, label: 'Secure Transactions', value: '100%' },
                { icon: TrendingUp, label: 'Revenue Growth', value: '45%' }
              ].map((item, index) => (
                <Card key={index} className="border-2 bg-background/90 shadow-lg">
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-[#8BC34A]/20 to-[#0288D1]/20 flex items-center justify-center shadow-md">
                      <item.icon className="h-6 w-6 text-[#0288D1]" />
                    </div>
                    <div className="text-3xl bg-gradient-to-r from-[#8BC34A] to-[#0288D1] bg-clip-text text-transparent drop-shadow-lg">
                      {item.value}
                    </div>
                    <p className="text-sm drop-shadow-md">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Now integrated into landing page */}
      <section id="contact" className="py-20 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/95 dark:bg-background/95 backdrop-blur-sm p-8 lg:p-12 rounded-2xl border border-border/50 shadow-2xl">
            <Badge className="bg-[#0288D1]/90 text-white border-[#0288D1]/20 mb-4 shadow-lg">
              Get in Touch
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
              Contact Us
            </h2>
            <p className="text-lg lg:text-xl drop-shadow-md leading-relaxed">
              Have questions? We're here to help you get started with Smart Cooperative Hub
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8 bg-background/60 dark:bg-background/70 backdrop-blur-md p-8 rounded-2xl border border-border/50">
              <div>
                <h3 className="text-2xl mb-6 drop-shadow-lg">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0288D1]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#0288D1]" />
                    </div>
                    <div>
                      <h4 className="mb-1">Email</h4>
                      <p className="text-muted-foreground">info@smartcoophub.com</p>
                      <p className="text-muted-foreground text-sm">support@smartcoophub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#8BC34A]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#8BC34A]" />
                    </div>
                    <div>
                      <h4 className="mb-1">Phone</h4>
                      <p className="text-muted-foreground">+250 788 000 000</p>
                      <p className="text-muted-foreground text-sm">Mon-Fri: 8AM - 6PM EAT</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0288D1]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#0288D1]" />
                    </div>
                    <div>
                      <h4 className="mb-1">Location</h4>
                      <p className="text-muted-foreground">Kigali, Rwanda</p>
                      <p className="text-muted-foreground text-sm">KG 11 Ave, Innovation City</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="mb-4">Office Hours</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl border-2 border-border shadow-xl">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      placeholder="+250 XXX XXX XXX"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject *</Label>
                    <Input
                      id="contact-subject"
                      placeholder="How can we help?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    className="bg-background/50 resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white shadow-xl hover:shadow-2xl">
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-[#8BC34A] to-[#0288D1] text-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-5xl">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-xl text-white/90">
            Join thousands of cooperatives across Rwanda that are already benefiting from digital transformation.
          </p>
          {!hideAuthButtons && (
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/signin')} className="bg-white text-[#0288D1] hover:bg-white/90">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/signin')} className="border-white text-white hover:bg-white/10">
                Sign In to Your Account
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img src={logo} alt="Smart Cooperative Hub" className="h-14" />
              <p className="text-sm text-muted-foreground">
                Empowering Rwandan cooperatives through digital innovation and blockchain technology.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@smartcoophub.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+250 788 000 000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><button onClick={() => navigate('/signin')} className="hover:text-foreground">Get Started</button></li>
                <li><button onClick={() => setShowAbout(true)} className="hover:text-foreground">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><button onClick={() => setShowChatbot(true)} className="hover:text-foreground">Support</button></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Smart Cooperative Hub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* About Us Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src={logo} alt="Smart Cooperative Hub" className="h-8" />
              About Smart Cooperative Hub
            </DialogTitle>
            <DialogDescription>
              Empowering Rwandan cooperatives through digital transformation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower Rwandan cooperatives through innovative digital solutions that enhance transparency, 
                improve market access, and drive sustainable economic growth across rural communities.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3">What We Do</h3>
              <p className="text-muted-foreground">
                Smart Cooperative Hub is a comprehensive digital platform that helps cooperatives manage their operations, 
                connect with markets, and maintain regulatory compliance. We combine modern technology with deep 
                understanding of the Rwandan cooperative sector to deliver solutions that truly make a difference.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3">Our Impact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { value: '500+', label: 'Cooperatives Served' },
                  { value: '10,000+', label: 'Members Empowered' },
                  { value: '50M+', label: 'RWF Transactions' },
                  { value: '98%', label: 'Satisfaction Rate' }
                ].map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-1 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Dialog */}
      <Dialog open={showChatbot} onOpenChange={setShowChatbot}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#0288D1]" />
              Chat Support
            </DialogTitle>
            <DialogDescription>
              Ask us anything about Smart Cooperative Hub
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-80 overflow-y-auto space-y-3 p-4 bg-muted/20 rounded-lg">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white'
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <Button type="submit" size="icon" className="bg-[#0288D1]">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Help Button */}
      {!hideAuthButtons && (
        <Button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
