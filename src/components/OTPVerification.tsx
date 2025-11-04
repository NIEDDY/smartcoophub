import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OTPVerificationProps {
  email: string;
  onVerified: (code: string) => void;
  onResend: () => void;
  purpose?: 'registration' | 'password-reset';
}

export function OTPVerification({ email, onVerified, onResend, purpose = 'registration' }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      // In production, verify the OTP with backend
      // For now, we'll accept any 6-digit code
      toast.success('Email verified successfully!');
      onVerified(code);
      setIsVerifying(false);
    }, 1000);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    onResend();
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    setCanResend(false);
    toast.success('New verification code sent to your email');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-2">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#8BC34A] to-[#0288D1] rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent a 6-digit verification code to<br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-center block">Enter Verification Code</Label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-medium"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
              disabled={isVerifying || otp.join('').length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={!canResend}
                className="text-[#0288D1]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              The verification code will expire in 10 minutes
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
