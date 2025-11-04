import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { cooperativeService } from '../lib/services/cooperative.service';

export function CooperativeRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    type: '',
    description: '',
    foundedDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.registrationNumber || !formData.email || !formData.phone || 
        !formData.address || !formData.district || !formData.sector || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create cooperative in database
      const response = await cooperativeService.create(formData as any, {});
      
      toast.success('Cooperative registered successfully!', {
        description: 'Your cooperative is pending approval. You will be notified once approved.',
      });

      // Reset form
      setFormData({
        name: '',
        registrationNumber: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        type: '',
        description: '',
        foundedDate: '',
      });

      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.message || 'Failed to register cooperative. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#0288D1] to-[#8BC34A] text-white">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <div>
                <CardTitle className="text-2xl">Register Your Cooperative</CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in your cooperative's information. Your application will be reviewed and approved by our admin team.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Cooperative Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Kigali Coffee Cooperative"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      placeholder="e.g., REG-2024-001"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="cooperative@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+250 788 000 000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Cooperative Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                        <SelectItem value="DAIRY">Dairy</SelectItem>
                        <SelectItem value="COFFEE">Coffee</SelectItem>
                        <SelectItem value="TEA">Tea</SelectItem>
                        <SelectItem value="HANDICRAFT">Handicraft</SelectItem>
                        <SelectItem value="SAVINGS_CREDIT">Savings & Credit</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundedDate">Founded Date</Label>
                    <Input
                      id="foundedDate"
                      name="foundedDate"
                      type="date"
                      value={formData.foundedDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your cooperative..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Select value={formData.district} onValueChange={(value) => handleSelectChange('district', value)}>
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GASABO">Gasabo</SelectItem>
                        <SelectItem value="KICUKIRO">Kicukiro</SelectItem>
                        <SelectItem value="NYARUGENGE">Nyarugenge</SelectItem>
                        <SelectItem value="MUSANZE">Musanze</SelectItem>
                        <SelectItem value="HUYE">Huye</SelectItem>
                        <SelectItem value="RUBAVU">Rubavu</SelectItem>
                        <SelectItem value="RUSIZI">Rusizi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector *</Label>
                    <Input
                      id="sector"
                      name="sector"
                      placeholder="e.g., Remera"
                      value={formData.sector}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cell">Cell</Label>
                    <Input
                      id="cell"
                      name="cell"
                      placeholder="e.g., Kigali"
                      value={formData.cell}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="village">Village</Label>
                    <Input
                      id="village"
                      name="village"
                      placeholder="e.g., Kigali"
                      value={formData.village}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="border-t pt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0288D1] hover:bg-[#0277BD] flex-1"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Cooperative'}
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Once you submit your application, it will be reviewed by our admin team. You will receive an email notification when your cooperative is approved. After approval, you can start managing your cooperative, adding products, and engaging with the marketplace.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
