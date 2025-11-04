import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  LogOut,
  Menu,
  X,
  User,
  Moon,
  Sun,
  Settings,
  LucideIcon,
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Megaphone,
  Home,
  CheckCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { permissions } from '../lib/permissions';

interface NavigationItem {
  path: string;
  name: string;
  icon: LucideIcon;
}

export function MainLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  // Get navigation items based on user role and permissions
  const getNavigation = (): NavigationItem[] => {
    const baseNav: NavigationItem[] = [];

    // Dashboard for all authenticated users
    baseNav.push({ path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard });

    // Approvals for super admin only
    if (permissions.canApproveCooperatives(user.role)) {
      baseNav.push({ path: '/approvals', name: 'Approvals', icon: CheckCircle });
    }

    // Cooperative management for cooperative admin and super admin
    if (permissions.canManageMembers(user.role)) {
      baseNav.push({ path: '/cooperative', name: 'Cooperative', icon: Building2 });
    }

    // Marketplace for buyers, members, and cooperative admins (not for super_admin and regulator)
    if ((permissions.canPlaceOrders(user.role) || permissions.canManageProducts(user.role)) && 
        user.role !== 'SUPER_ADMIN' && user.role !== 'RCA_REGULATOR') {
      baseNav.push({ path: '/marketplace', name: 'Marketplace', icon: ShoppingCart });
    }

    // Announcements for all (except regulator)
    if (permissions.hasPermission(user.role, 'manage_announcements')) {
      baseNav.push({ path: '/announcements', name: 'Announcements', icon: Megaphone });
    }

    // Payments for cooperative admins and super admins
    if (permissions.hasPermission(user.role, 'manage_payments')) {
      baseNav.push({ path: '/payments', name: 'Payments', icon: CreditCard });
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'COOP_ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'MEMBER':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'BUYER':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'RCA_REGULATOR':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'SECRETARY':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
      case 'ACCOUNTANT':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'COOP_ADMIN':
        return 'Cooperative Admin';
      case 'MEMBER':
        return 'Member';
      case 'BUYER':
        return 'Buyer';
      case 'RCA_REGULATOR':
        return 'Regulator';
      case 'SECRETARY':
        return 'Secretary';
      case 'ACCOUNTANT':
        return 'Accountant';
      default:
        return role;
    }
  };

  const getPageTitle = () => {
    const pathname = location.pathname;
    
    if (pathname === '/profile') return 'Profile';
    if (pathname === '/dashboard') return `${getRoleDisplayName(user.role)} Dashboard`;
    if (pathname === '/home') return 'Smart Cooperative Hub';
    
    const navItem = navigation.find(n => n.path === pathname);
    return navItem?.name || 'Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[95]
        w-64 bg-card border-r border-border
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Smart Cooperative Hub" className="h-20" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-[#8BC34A] to-[#0288D1] text-white">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user.name}</p>
                <Badge className={`${getRoleBadgeColor(user.role)} text-xs`}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="text-xs text-muted-foreground px-3 py-2">MAIN MENU</p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all text-left group
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}

            <Separator className="my-4" />

            <p className="text-xs text-muted-foreground px-3 py-2">SETTINGS</p>
            <button
              onClick={() => {
                navigate('/profile');
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all text-left group
                ${location.pathname === '/profile'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <Settings className="h-5 w-5 flex-shrink-0 group-hover:rotate-90 transition-transform" />
              <span className="text-sm">Settings</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-[100] bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4 shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
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

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#8BC34A] to-[#0288D1] text-white text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">{user.name.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>Toggle Theme</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
