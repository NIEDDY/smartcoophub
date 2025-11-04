import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import { OTPVerification } from './OTPVerification';
import { toast } from 'sonner';
import logo from '../assets/53449038dbd0f60b6d3e01246d9bc64048823ace.png';

type ResetStep = 'email' | 'otp' | 'new-password' | 'success';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending OTP to email
    setTimeout(() => {
      toast.success('Verification code sent to your email');
      setStep('otp');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleOTPVerified = (code: string) => {
    // OTP verified, move to new password step
    setStep('new-password');
  };

  const handleResendOTP = () => {
    // Resend OTP logic
    toast.success('New verification code sent');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    // Simulate password reset
    setTimeout(() => {
      toast.success('Password reset successfully!');
      setStep('success');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/signin')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
          <div className="text-center mb-6">
            <img src={logo} alt="Smart Cooperative Hub" className="h-14 sm:h-16 mx-auto mb-4" />
          </div>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <Card className="border-2">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">Forgot Password?</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Enter your email address and we'll send you a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 sm:h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white h-11 sm:h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <OTPVerification
            email={email}
            onVerified={handleOTPVerified}
            onResend={handleResendOTP}
            purpose="password-reset"
          />
        )}

        {/* New Password Step */}
        {step === 'new-password' && (
          <Card className="border-2">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">Set New Password</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Create a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-11 sm:h-12"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 sm:h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white h-11 sm:h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <Card className="border-2">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[#8BC34A] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">Password Reset Successful!</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your password has been reset successfully. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/signin')}
                className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white h-11 sm:h-12"
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
