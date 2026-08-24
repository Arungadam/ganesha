export type UserRole = 'owner' | 'admin' | 'collector' | 'viewer';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';

export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';

export type ExpenseCategory =
  | 'Decoration'
  | 'Ganesh Idol'
  | 'Sound'
  | 'Lighting'
  | 'Food'
  | 'Transportation'
  | 'Pandal'
  | 'Electrical'
  | 'Cultural Programs'
  | 'Puja Materials'
  | 'Cleaning'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  committeeId?: string;
  createdAt: string;
}

export interface CommitteeLocation {
  state: string;
  district: string;
  village: string;
  area: string;
  galli: string;
}

export interface FestivalYearConfig {
  id: string;
  year: number; // e.g. 2026, 2027, 2028
  startDate: string;
  endDate: string;
  visarjanDate: string;
  chandaTarget: number;
  upiId?: string;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  organizerName: string;
  contactNumber: string;
  location: CommitteeLocation;
  years: FestivalYearConfig[];
  currentYear: number;
  createdAt: string;
}

export interface Contributor {
  id: string;
  committeeId: string;
  year: number;
  name: string;
  phone: string;
  address?: string;
  totalDonated: number;
  totalPending: number;
  contributionCount: number;
  firstDonationDate: string;
  lastDonationDate: string;
}

export interface Contribution {
  id: string;
  receiptNumber: string; // e.g. GS26-000248
  committeeId: string;
  year: number;
  contributorId: string;
  contributorName: string;
  contributorPhone: string;
  amount: number;
  paidAmount: number;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectorName: string;
  collectorId: string;
  notes?: string;
  galli?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  committeeId: string;
  year: number;
  expenseName: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidBy: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  billReceiptUrl?: string;
  createdAt: string;
}

export interface FestivalEvent {
  id: string;
  committeeId: string;
  year: number;
  eventName: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizerInCharge?: string;
  isCompleted?: boolean;
}

export interface CommitteeMember {
  id: string;
  committeeId: string;
  userId?: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  totalCollected: number;
  collectionCount: number;
  joinedDate: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  committeeId: string;
  year: number;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalCollection: number;
  totalContributors: number;
  totalExpenses: number;
  remainingBalance: number;
  collectionTarget: number;
  collectionProgressPercent: number;
  paidCollections: number;
  pendingCollections: number;
  recentContributions: Contribution[];
  upcomingEvents: FestivalEvent[];
  categoryExpenses: { category: ExpenseCategory; amount: number; percentage: number }[];
  dailyCollections: { date: string; amount: number; count: number }[];
  paymentMethodStats: { method: PaymentMethod; amount: number; count: number }[];
}
