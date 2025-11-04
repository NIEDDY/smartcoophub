import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentType: 'contribution' | 'share_purchase' | 'product_payment' | 'fee';
  amount?: number;
  description?: string;
  onPaymentComplete?: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  paymentType,
  amount: initialAmount = 0,
  description: initialDescription = '',
  onPaymentComplete,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'bank_transfer' | 'cash'>('mobile_money');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(initialAmount.toString());
  const [description, setDescription] = useState(initialDescription);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'mobile_money' && !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setPaymentSuccess(true);

    toast.success('Payment completed successfully!');

    // Reset form after 1.5 seconds and close dialog
    setTimeout(() => {
      setPaymentSuccess(false);
      setPhoneNumber('');
      setAmount(initialAmount.toString());
      setDescription(initialDescription);
      onPaymentComplete?.();
      onOpenChange(false);
    }, 1500);
  };

  const getPaymentTypeLabel = () => {
    switch (paymentType) {
      case 'contribution':
        return 'Member Contribution';
      case 'share_purchase':
        return 'Share Purchase';
      case 'product_payment':
        return 'Product Payment';
      case 'fee':
        return 'Fee Payment';
      default:
        return 'Payment';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Complete your {getPaymentTypeLabel().toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8BC34A]/10 mb-4">
              <CheckCircle className="h-8 w-8 text-[#8BC34A]" />
            </div>
            <h3 className="mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground">
              Your payment has been processed successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-type">Payment Type</Label>
              <Input
                id="payment-type"
                value={getPaymentTypeLabel()}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (RWF) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>

            {!initialDescription && (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === 'mobile_money' ? 'default' : 'outline'}
                  className={paymentMethod === 'mobile_money' ? 'bg-[#0288D1]' : ''}
                  onClick={() => setPaymentMethod('mobile_money')}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile Money
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'bank_transfer' ? 'default' : 'outline'}
                  className={paymentMethod === 'bank_transfer' ? 'bg-[#0288D1]' : ''}
                  onClick={() => setPaymentMethod('bank_transfer')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Bank
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  className={paymentMethod === 'cash' ? 'bg-[#0288D1]' : ''}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cash
                </Button>
              </div>
            </div>

            {paymentMethod === 'mobile_money' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="provider">Mobile Money Provider</Label>
                  <Select value={mobileMoneyProvider} onValueChange={(value: 'MTN' | 'Airtel') => setMobileMoneyProvider(value)}>
                    <SelectTrigger id="provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                      <SelectItem value="Airtel">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250 XXX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    You will receive a prompt on your phone to approve the payment
                  </p>
                </div>
              </>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="bg-[#0288D1]/5 p-4 rounded-lg border border-[#0288D1]/20">
                <p className="text-sm mb-2">Bank Transfer Instructions:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Bank:</strong> Bank of Kigali</p>
                  <p><strong>Account Name:</strong> Smart Cooperative Hub</p>
                  <p><strong>Account Number:</strong> BK-1234567890</p>
                  <p className="mt-2">Please use your member ID as reference</p>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-[#8BC34A]/5 p-4 rounded-lg border border-[#8BC34A]/20">
                <p className="text-sm text-muted-foreground">
                  Cash payments should be made at the cooperative office. This transaction will be marked as pending until verified by the treasurer.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#8BC34A] hover:bg-[#7CB342]"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay ${parseFloat(amount || '0').toLocaleString()} RWF`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
