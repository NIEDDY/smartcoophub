import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPassword } from './components/ForgotPassword';
import { PublicProductsPage } from './components/PublicProductsPage';
import { MemberInvitation } from './components/MemberInvitation';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard.clean';
import { CooperativeAdminDashboard } from './components/dashboards/CooperativeAdminDashboard';
import { MemberDashboard } from './components/dashboards/MemberDashboard';
import { BuyerDashboardNew } from './components/dashboards/BuyerDashboardNew';
import { RegulatorDashboardNew } from './components/dashboards/RegulatorDashboardNew';
import { RoleGuard } from './components/RoleGuard';
import { CooperativeManagement } from './components/CooperativeManagement';
import { CooperativeApprovals } from './components/CooperativeApprovals';
import { CooperativeRegistration } from './components/CooperativeRegistration';
import { Marketplace } from './components/Marketplace';
import { Announcements } from './components/Announcements';
import { Profile } from './components/Profile';
import { PaymentManagement } from './components/PaymentManagement';
import { Toaster } from './components/ui/sonner';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Landing Page Wrapper
function LandingPageWrapper() {
  const { user } = useAuth();

  // If user logs in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LandingPage />;
}

// Invitation Page Wrapper
function InvitationPageWrapper() {
  const [invitationCode, setInvitationCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invitation = urlParams.get('invitation');
    if (invitation) {
      setInvitationCode(invitation);
    }
  }, []);

  if (!invitationCode) {
    return <Navigate to="/" replace />;
  }

  return <MemberInvitation invitationCode={invitationCode} />;
}

// Home Page (Landing page for logged-in users)
function HomePage() {
  return <LandingPage hideAuthButtons={true} />;
}

// Dashboard Router - renders appropriate dashboard based on role
function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  console.log('DashboardRouter - User role:', user.role, 'User:', user);

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'COOP_ADMIN':
      return <CooperativeAdminDashboard />;
    case 'MEMBER':
      return <MemberDashboard />;
    case 'BUYER':
      return <BuyerDashboardNew />;
    case 'RCA_REGULATOR':
      return <RegulatorDashboardNew />;
    default:
      return <MemberDashboard />;
  }
}

// App Content with Routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPageWrapper />} />
      <Route path="/signin" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/products" element={<PublicProductsPage />} />
      <Route path="/invitation" element={<InvitationPageWrapper />} />

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/register-cooperative" element={<CooperativeRegistration />} />
        <Route path="/approvals" element={<CooperativeApprovals />} />
        <Route path="/cooperative" element={<CooperativeManagement />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/payments" element={<PaymentManagement />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
