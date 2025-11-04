// User roles (matching database enum)
export type UserRole = 'SUPER_ADMIN' | 'RCA_REGULATOR' | 'COOP_ADMIN' | 'SECRETARY' | 'ACCOUNTANT' | 'MEMBER' | 'BUYER';

// Cooperative internal roles
export type CooperativeRole = 'admin' | 'secretary' | 'accountant' | 'member';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cooperativeId?: string;
  cooperativeRole?: CooperativeRole; // For cooperative members
  phone?: string;
  avatar?: string;
}

// Cooperative
export interface Cooperative {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  location: string;
  province: string;
  district: string;
  sector: string;
  description: string;
  establishedDate: string;
  memberCount: number;
  chairperson: string;
  treasurer: string;
  secretary: string;
  bankAccount?: string;
  mobileMoneyAccount?: string;
  status: 'active' | 'pending' | 'suspended';
  registeredDate?: string;
  verified?: boolean;
  logo?: string;
  rcaDocument?: string; // RCA verification document
  policies?: CooperativePolicy[];
}

// Cooperative Policy
export interface CooperativePolicy {
  id: string;
  title: string;
  description: string;
  content: string;
  document?: string; // Optional PDF document
  category: 'governance' | 'financial' | 'membership' | 'operations' | 'other';
  effectiveDate: string;
  createdBy: string;
  createdDate: string;
  lastUpdated?: string;
}

// Member
export interface Member {
  id: string;
  cooperativeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  contributions: number;
  shares: number;
  status: 'active' | 'inactive';
  avatar?: string;
}

// Financial Transaction
export interface Transaction {
  id: string;
  cooperativeId: string;
  type: 'income' | 'expense' | 'contribution';
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
  paymentMethod?: string;
  blockchainHash?: string;
}

// Product
export interface Product {
  id: string;
  cooperativeId: string;
  cooperativeName: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  availableStock: number;
  minOrder: number;
  images: string[];
  location: string;
  status: 'available' | 'out_of_stock' | 'discontinued';
  availability: 'in-stock' | 'out-of-stock' | 'discontinued';
  createdAt: string;
}

// Order
export interface Order {
  id: string;
  productId: string;
  productName: string;
  cooperativeId: string;
  cooperativeName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderDate: string;
  deliveryDate?: string;
}

// Payment
export interface Payment {
  id: string;
  userId: string;
  cooperativeId?: string;
  type: 'contribution' | 'share_purchase' | 'product_payment' | 'fee';
  amount: number;
  currency: 'RWF';
  paymentMethod: 'mobile_money' | 'bank_transfer' | 'cash';
  mobileMoneyProvider?: 'MTN' | 'Airtel';
  phoneNumber?: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  initiatedDate: string;
  completedDate?: string;
}

// Announcement
export interface Announcement {
  id: string;
  cooperativeId: string;
  cooperativeName: string;
  type: 'job' | 'training' | 'tender' | 'meeting' | 'general';
  title: string;
  description: string;
  location?: string;
  deadline?: string;
  requirements?: string[];
  contactPerson: string;
  contactPhone: string;
  visibility: 'public' | 'members_only';
  status: 'active' | 'closed';
  postedDate: string;
  applicants?: number;
}

// Application
export interface Application {
  id: string;
  announcementId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter: string;
  resume?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
}

// Report
export interface Report {
  id: string;
  cooperativeId: string;
  type: 'monthly' | 'quarterly' | 'annual';
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  memberContributions: number;
  generatedDate: string;
  generatedBy: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  cooperativeId?: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

// Member Request
export interface MemberRequest {
  id: string;
  memberId: string;
  memberName: string;
  cooperativeId: string;
  type: 'loan' | 'withdrawal' | 'complaint' | 'resignation' | 'other';
  title: string;
  description: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

// Approval Request (Multi-signature)
export interface ApprovalRequest {
  id: string;
  cooperativeId: string;
  type: 'transaction' | 'member_approval' | 'loan' | 'policy_change' | 'other';
  title: string;
  description: string;
  amount?: number;
  initiatedBy: string;
  initiatedDate: string;
  requiredApprovals: number;
  approvals: {
    userId: string;
    userName: string;
    role: string;
    approved: boolean;
    timestamp: string;
    notes?: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

// Product Review
export interface ProductReview {
  id: string;
  productId: string;
  cooperativeId: string;
  buyerId: string;
  buyerName: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  reviewDate: string;
  verified: boolean; // Only verified purchases can review
}

// Favorite Product
export interface FavoriteProduct {
  id: string;
  buyerId: string;
  productId: string;
  cooperativeId: string;
  addedDate: string;
}

// Cooperative Document
export interface CooperativeDocument {
  id: string;
  cooperativeId: string;
  type: 'registration' | 'constitution' | 'financial_report' | 'meeting_minutes' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedDate: string;
  visibility: 'admin_only' | 'committee' | 'all_members' | 'public';
}

// Member Financial Record
export interface MemberFinancialRecord {
  id: string;
  memberId: string;
  cooperativeId: string;
  shares: number;
  totalContributions: number;
  savings: number;
  dividends: number;
  loans: number;
  lastUpdated: string;
}
