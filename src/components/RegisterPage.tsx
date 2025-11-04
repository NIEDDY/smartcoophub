import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Building2, 
  ShoppingCart, 
  Mail, 
  Lock, 
  Phone, 
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileUp,
  Users
} from 'lucide-react';
import logo from 'figma:asset/53449038dbd0f60b6d3e01246d9bc64048823ace.png';
import { toast } from 'sonner';
import { rwandaDistricts, getSectorsForDistrict } from '../lib/rwandaLocations';
import { OTPVerification } from './OTPVerification';
import { authService } from '../lib/services/auth.service';

type RegistrationStep = 'select-type' | 'cooperative-form' | 'buyer-form' | 'otp-verification' | 'success';
type UserType = 'cooperative' | 'buyer' | null;

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>('select-type');
  const [userType, setUserType] = useState<UserType>(null);
  const [pendingEmail, setPendingEmail] = useState('');

  // Cooperative Registration Data
  const [cooperativeData, setCooperativeData] = useState({
    name: '',
    type: '',
    district: '',
    sector: '',
    location: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    chairperson: '',
    memberCount: '',
    establishedDate: '',
    rcaDocument: null as File | null,
  });

  // Buyer Registration Data
  const [buyerData, setBuyerData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);

  const handleCooperativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!cooperativeData.name || !cooperativeData.email || !cooperativeData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (cooperativeData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (cooperativeData.password !== cooperativeData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Call backend registration API
      await authService.register({
        email: cooperativeData.email,
        password: cooperativeData.password,
        firstName: cooperativeData.name,
        lastName: cooperativeData.chairperson || 'Cooperative',
        phone: cooperativeData.phone,
        role: 'COOP_ADMIN',
      });
      
      // Move to OTP verification
      setPendingEmail(cooperativeData.email);
      toast.success('Registration successful! Check your email for OTP code.');
      setStep('otp-verification');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!buyerData.fullName || !buyerData.email || !buyerData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (buyerData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (buyerData.password !== buyerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Call backend registration API
      const [firstName, ...lastNameParts] = buyerData.fullName.split(' ');
      await authService.register({
        email: buyerData.email,
        password: buyerData.password,
        firstName: firstName,
        lastName: lastNameParts.join(' ') || 'User',
        phone: buyerData.phone,
        role: 'BUYER',
      });
      
      // Move to OTP verification
      setPendingEmail(buyerData.email);
      toast.success('Registration successful! Check your email for OTP code.');
      setStep('otp-verification');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = (code: string) => {
    toast.success('Email verified successfully!');
    setStep('success');
  };

  const handleResendOTP = () => {
    toast.success('New verification code sent to your email');
  };

  const resetForm = () => {
    setStep('select-type');
    setUserType(null);
    setPendingEmail('');
    setCooperativeData({
      name: '',
      type: '',
      district: '',
      sector: '',
      location: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      chairperson: '',
      memberCount: '',
      establishedDate: '',
      rcaDocument: null,
    });
    setBuyerData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      organizationType: '',
      location: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8BC34A]/5 via-[#0288D1]/5 to-background p-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 'select-type') {
                navigate('/signin');
              } else {
                resetForm();
              }
            }}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 'select-type' ? 'Back to Sign In' : 'Back to Selection'}
          </Button>
          <div className="text-center mb-6">
            <img src={logo} alt="Smart Cooperative Hub" className="h-14 sm:h-16 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl mb-2">Create Your Account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Join Smart Cooperative Hub and start transforming your cooperative
            </p>
          </div>
        </div>

        {/* Step 1: Select User Type */}
        {step === 'select-type' && (
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl">Choose Registration Type</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Select how you want to join Smart Cooperative Hub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Registration Options */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Cooperative Registration */}
                <Card
                  className="cursor-pointer hover:border-[#0288D1] hover:shadow-lg transition-all border-2"
                  onClick={() => {
                    setUserType('cooperative');
                    setStep('cooperative-form');
                  }}
                >
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#0288D1]/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-[#0288D1]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">Register Cooperative</h3>
                      <p className="text-sm text-muted-foreground">
                        Register your cooperative organization to manage members, finances, and products
                      </p>
                    </div>
                    <Button className="w-full bg-[#0288D1] hover:bg-[#0277BD]">
                      Select
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Buyer Registration */}
                <Card
                  className="cursor-pointer hover:border-[#8BC34A] hover:shadow-lg transition-all border-2"
                  onClick={() => {
                    setUserType('buyer');
                    setStep('buyer-form');
                  }}
                >
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#8BC34A]/10 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-[#8BC34A]" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">Register as Buyer</h3>
                      <p className="text-sm text-muted-foreground">
                        Create a buyer account to browse and purchase products from cooperatives
                      </p>
                    </div>
                    <Button className="w-full bg-[#8BC34A] hover:bg-[#7CB342]">
                      Select
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Already have an account?
                </p>
                <Link to="/signin">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Cooperative Registration Form */}
        {step === 'cooperative-form' && (
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-[#0288D1]" />
                <CardTitle className="text-xl sm:text-2xl">Register Your Cooperative</CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base">
                Fill in your cooperative information. You will be registered as the Cooperative Admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCooperativeSubmit} className="space-y-6">
                {/* Cooperative Information */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#0288D1]" />
                    Cooperative Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="coop-name">Cooperative Name *</Label>
                      <Input
                        id="coop-name"
                        placeholder="e.g., Kigali Coffee Cooperative"
                        value={cooperativeData.name}
                        onChange={(e) => setCooperativeData({ ...cooperativeData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coop-type">Type *</Label>
                      <Select 
                        value={cooperativeData.type} 
                        onValueChange={(value) => setCooperativeData({ ...cooperativeData, type: value })}
                      >
                        <SelectTrigger id="coop-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agricultural">Agricultural</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Coffee">Coffee</SelectItem>
                          <SelectItem value="Tea">Tea</SelectItem>
                          <SelectItem value="Handicraft">Handicraft</SelectItem>
                          <SelectItem value="Savings & Credit">Savings & Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="coop-district">District *</Label>
                      <Select 
                        value={cooperativeData.district} 
                        onValueChange={(value) => {
                          setCooperativeData({ ...cooperativeData, district: value, sector: '' });
                        }}
                      >
                        <SelectTrigger id="coop-district">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {rwandaDistricts.map((district) => (
                            <SelectItem key={district.name} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coop-sector">Sector *</Label>
                      <Select
                        value={cooperativeData.sector}
                        onValueChange={(value) => setCooperativeData({ ...cooperativeData, sector: value })}
                        disabled={!cooperativeData.district}
                      >
                        <SelectTrigger id="coop-sector">
                          <SelectValue placeholder={cooperativeData.district ? "Select sector" : "Select district first"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {cooperativeData.district && getSectorsForDistrict(cooperativeData.district).map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coop-location">Full Address</Label>
                    <Textarea
                      id="coop-location"
                      placeholder="Complete address"
                      value={cooperativeData.location}
                      onChange={(e) => setCooperativeData({ ...cooperativeData, location: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#0288D1]" />
                    Contact Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="coop-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="coop-phone"
                          placeholder="+250 XXX XXX XXX"
                          className="pl-10"
                          value={cooperativeData.phone}
                          onChange={(e) => setCooperativeData({ ...cooperativeData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coop-email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="coop-email"
                          type="email"
                          placeholder="cooperative@example.com"
                          className="pl-10"
                          value={cooperativeData.email}
                          onChange={(e) => setCooperativeData({ ...cooperativeData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* RCA Document Upload */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <FileUp className="h-4 w-4 text-[#0288D1]" />
                    RCA Verification Document
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="coop-rca-document">
                      RCA Registration Document (PDF) *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Upload your official RCA registration document for verification.
                    </p>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-[#0288D1] transition-colors">
                      <input
                        id="coop-rca-document"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.type === 'application/pdf') {
                              setCooperativeData({ ...cooperativeData, rcaDocument: file });
                            } else {
                              toast.error('Please upload a PDF file');
                              e.target.value = '';
                            }
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="coop-rca-document"
                        className="cursor-pointer"
                      >
                        {cooperativeData.rcaDocument ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-[#8BC34A]">
                              <FileUp className="h-8 w-8" />
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <p className="text-sm">{cooperativeData.rcaDocument.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(cooperativeData.rcaDocument.size / 1024).toFixed(2)} KB
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setCooperativeData({ ...cooperativeData, rcaDocument: null });
                              }}
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm">Click to upload RCA document</p>
                            <p className="text-xs text-muted-foreground">PDF only, max 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Admin Account Setup */}
                <div className="space-y-4 p-4 bg-[#0288D1]/5 rounded-lg border border-[#0288D1]/20">
                  <div className="flex items-center gap-2 text-[#0288D1]">
                    <CheckCircle className="h-5 w-5" />
                    <h4>Admin Account Setup</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You will be registered as the Cooperative Admin with full access to manage your cooperative.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Minimum 8 characters"
                          className="pl-10"
                          value={cooperativeData.password}
                          onChange={(e) => setCooperativeData({ ...cooperativeData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                          className="pl-10"
                          value={cooperativeData.confirmPassword}
                          onChange={(e) => setCooperativeData({ ...cooperativeData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
                >
                  Continue to Verification
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Buyer Registration Form */}
        {step === 'buyer-form' && (
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-5 w-5 text-[#8BC34A]" />
                <CardTitle className="text-xl sm:text-2xl">Register as Buyer</CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base">
                Create your buyer account to start purchasing products from cooperatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuyerSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#8BC34A]" />
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="buyer-name"
                        placeholder="Your full name"
                        className="pl-10"
                        value={buyerData.fullName}
                        onChange={(e) => setBuyerData({ ...buyerData, fullName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="buyer-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={buyerData.email}
                          onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyer-phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="buyer-phone"
                          placeholder="+250 XXX XXX XXX"
                          className="pl-10"
                          value={buyerData.phone}
                          onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Organization Information (Optional) */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#8BC34A]" />
                    Organization Information (Optional)
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-org-name">Organization Name</Label>
                      <Input
                        id="buyer-org-name"
                        placeholder="Company or business name"
                        value={buyerData.organizationName}
                        onChange={(e) => setBuyerData({ ...buyerData, organizationName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyer-org-type">Organization Type</Label>
                      <Select 
                        value={buyerData.organizationType} 
                        onValueChange={(value) => setBuyerData({ ...buyerData, organizationType: value })}
                      >
                        <SelectTrigger id="buyer-org-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Restaurant">Restaurant</SelectItem>
                          <SelectItem value="Hotel">Hotel</SelectItem>
                          <SelectItem value="Supermarket">Supermarket</SelectItem>
                          <SelectItem value="Retailer">Retailer</SelectItem>
                          <SelectItem value="Exporter">Exporter</SelectItem>
                          <SelectItem value="Processor">Processor</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer-location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="buyer-location"
                        placeholder="City, Country"
                        className="pl-10"
                        value={buyerData.location}
                        onChange={(e) => setBuyerData({ ...buyerData, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Security */}
                <div className="space-y-4 p-4 bg-[#8BC34A]/5 rounded-lg border border-[#8BC34A]/20">
                  <div className="flex items-center gap-2 text-[#8BC34A]">
                    <Lock className="h-5 w-5" />
                    <h4>Account Security</h4>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="buyer-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="buyer-password"
                          type="password"
                          placeholder="Minimum 8 characters"
                          className="pl-10"
                          value={buyerData.password}
                          onChange={(e) => setBuyerData({ ...buyerData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyer-confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="buyer-confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                          className="pl-10"
                          value={buyerData.confirmPassword}
                          onChange={(e) => setBuyerData({ ...buyerData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
                >
                  Continue to Verification
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: OTP Verification */}
        {step === 'otp-verification' && (
          <OTPVerification
            email={pendingEmail}
            onVerified={handleOTPVerified}
            onResend={handleResendOTP}
            purpose="registration"
          />
        )}

        {/* Step 5: Success */}
        {step === 'success' && (
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#8BC34A] to-[#0288D1] rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">Registration Successful!</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {userType === 'cooperative' ? (
                  <>
                    Your cooperative has been registered successfully! 
                    Your account is pending approval by the Super Admin. 
                    You will receive an email notification once approved.
                  </>
                ) : (
                  <>
                    Your buyer account has been created successfully! 
                    You can now sign in and start browsing products from cooperatives.
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate('/signin')}
                className="w-full h-12 bg-gradient-to-r from-[#8BC34A] to-[#0288D1] text-white"
              >
                Go to Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="text-center">
                <Link to="/" className="text-sm text-[#0288D1] hover:underline">
                  Return to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
