/**
 * Centralized enums for type safety and to eliminate magic strings.
 * These enums correspond to the Prisma schema enums.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RCA_REGULATOR = 'RCA_REGULATOR',
  COOP_ADMIN = 'COOP_ADMIN',
  SECRETARY = 'SECRETARY',
  ACCOUNTANT = 'ACCOUNTANT',
  MEMBER = 'MEMBER',
  BUYER = 'BUYER',
}

export enum CooperativeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  CONTRIBUTION = 'CONTRIBUTION',
  DIVIDEND = 'DIVIDEND',
  LOAN = 'LOAN',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPACK = 'PAYPACK',
}

export enum AnnouncementType {
  JOB = 'JOB',
  MEETING = 'MEETING',
  TRAINING = 'TRAINING',
  TENDER = 'TENDER',
  GENERAL = 'GENERAL',
}

export enum RequestType {
  LOAN = 'LOAN',
  WITHDRAWAL = 'WITHDRAWAL',
  MEMBERSHIP = 'MEMBERSHIP',
  COMPLAINT = 'COMPLAINT',
  RESIGNATION = 'RESIGNATION',
}

export enum OTPType {
  REGISTRATION = 'REGISTRATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export enum JobApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
