/**
 * Domain types for the TravelXM Agent Portal.
 *
 * Pages depend on these interfaces only — the static data in `lib/data.ts`
 * implements them today, and a real API client can implement them later
 * without touching any component.
 */

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "active"
  | "completed"
  | "cancelled"
  | "traveling";

export interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalAmount: number;
  status: BookingStatus;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  address?: string;
  notes?: string;
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
}

export type PackageCategory =
  | "Beach & Relaxation"
  | "Adventure"
  | "Cultural"
  | "Wildlife"
  | "Honeymoon"
  | "Family"
  | "Luxury";

export interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  category: PackageCategory;
  pricePerPerson: number;
  duration: number;
  commissionRate: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isFeatured: boolean;
  highlights: string[];
}

export type CommissionStatus = "pending" | "earned" | "paid";

export interface Commission {
  id: number;
  bookingId: number;
  amount: number;
  status: CommissionStatus;
  earnedAt: string;
}

export type AgentTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface CommissionAnalytics {
  agentTier: AgentTier;
  totalEarned: number;
  pendingAmount: number;
  thisMonth: number;
  nextPayoutDate: string;
  monthlyBreakdown: MonthlyEarning[];
}

export interface DashboardSummary {
  totalRevenue: number;
  activeBookings: number;
  totalCommissions: number;
  totalCustomers: number;
  agentTier: AgentTier;
}

export interface ActivityItem {
  id: number;
  description: string;
  customerName: string;
  createdAt: string;
  amount?: number;
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory =
  | "booking"
  | "payment"
  | "package"
  | "technical"
  | "account"
  | "other";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
}

export type PaymentStatus =
  | "succeeded"
  | "requires_payment_method"
  | "canceled"
  | "processing"
  | "requires_action"
  | "requires_confirmation";

export interface PaymentTransaction {
  id: string;
  /** Amount in the currency's minor unit (cents). */
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  customerEmail: string;
  createdAt: string;
}

export interface PaymentsDashboard {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  totalCollected: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  recentTransactions: PaymentTransaction[];
}

export type CrmSyncStatus = "synced" | "failed" | "pending";

export interface CrmSyncRecord {
  entityType: "customer" | "booking";
  portalId: number;
  crmId: string;
  syncStatus: CrmSyncStatus;
  lastSyncedAt: string;
}

export interface CrmStatus {
  totalSynced: number;
  totalFailed: number;
  records: CrmSyncRecord[];
}
