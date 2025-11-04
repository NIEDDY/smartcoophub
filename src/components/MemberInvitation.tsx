import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { mockCooperatives } from '../lib/mockData';
import { 
  CheckCircle, 
  Mail, 
  Lock, 
  User,
  Building2,
  ArrowRight
} from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { toast } from 'sonner';

interface MemberInvitationProps {
  invitationCode?: string;
}

export function MemberInvitation({ invitationCode }: MemberInvitationProps) {
  const { login } = useAuth();
  const [step, setStep] = useState<'verify' | 'setup'>('verify');
  const [verificationCode, setVerificationCode] = useState(invitationCode || '');
  const [invitationData, setInvitationData] = useState<{
    memberName: string;
    memberEmail: string;
    cooperativeId: string;
    cooperativeName: string;
  } | null>(null);
  
  const [setupData, setSetupData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleVerifyInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock verification - In real app, this would verify with backend
    if (verificationCode.length >= 6) {
      // Simulate successful verification
      const mockInvitation = {
        memberName: 'New Member',
        memberEmail: 'newmember@terimbere.coop',
        cooperativeId: 'coop1',
        cooperativeName: 'Terimbere Coffee Cooperative',
      };
      
      setInvitationData(mockInvitation);
      setStep('setup');
      toast.success('Invitation verified! Please set up your account.');
    } else {
      toast.error('Invalid invitation code. Please check and try again.');
    }
  };

  const handleSetupAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!setupData.username || !setupData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (setupData.password !== setupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (setupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // In real app, this would create the account and then login
    // For now, we'll just login with the member account
    toast.success('Account setup successful! Logging you in...');
    
    setTimeout(() => {
      login('marie@terimbere.coop', 'password123');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#8BC34A]/5 via-[#0288D1]/5 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Smart Cooperative Hub" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Member Invitation</h1>
          <p className="text-muted-foreground">
            Complete your registration to join your cooperative
          </p>
        </div>

        {step === 'verify' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#8BC34A]" />
                Verify Your Invitation
              </CardTitle>
              <CardDescription>
                Enter the invitation code you received from your cooperative admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyInvitation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invitation-code">Invitation Code *</Label>
                  <Input
                    id="invitation-code"
                    placeholder="Enter your 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                    className="text-center text-lg tracking-wider"
                  />
                  <p className="text-xs text-muted-foreground">
                    The invitation code was sent to your email by your cooperative admin
                  </p>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white">
                  Verify Invitation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="bg-[#8BC34A]/5 p-4 rounded-lg border border-[#8BC34A]/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Members cannot register directly. Your cooperative admin must invite you first.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#8BC34A]" />
                <Badge className="bg-[#8BC34A]/10 text-[#8BC34A]">Verified</Badge>
              </div>
              <CardTitle>Set Up Your Account</CardTitle>
              <CardDescription>
                Create your login credentials to access the member dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetupAccount} className="space-y-4">
                {/* Display invitation details */}
                {invitationData && (
                  <div className="p-4 bg-[#0288D1]/5 rounded-lg border border-[#0288D1]/20 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-[#0288D1]" />
                      <span className="text-muted-foreground">Cooperative:</span>
                      <span>{invitationData.cooperativeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-[#0288D1]" />
                      <span className="text-muted-foreground">Email:</span>
                      <span>{invitationData.memberEmail}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Choose a username"
                      className="pl-10"
                      value={setupData.username}
                      onChange={(e) => setSetupData({ ...setupData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      className="pl-10"
                      value={setupData.password}
                      onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={setupData.confirmPassword}
                      onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white">
                  Complete Setup & Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
