import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { toast } from 'sonner';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to dashboard when user successfully logs in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        toast.success('Welcome back! Redirecting to your dashboard...');
        // Navigation will happen automatically via useEffect when user state updates
      } else {
        toast.error('Invalid email or password. Please check your credentials and try again.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8BC34A]/5 via-[#0288D1]/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center mb-6">
            <img src={logo} alt="Smart Cooperative Hub" className="h-14 sm:h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to access your Smart Cooperative Hub account
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">Sign In to Your Account</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 h-11 sm:h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-[#0288D1] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-11 sm:h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Separator className="my-6" />

              {/* Create Account Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Don't have an account?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-2 border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1]/10"
                  onClick={() => navigate('/register')}
                  disabled={isSubmitting}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
