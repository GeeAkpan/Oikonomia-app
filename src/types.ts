/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Owner' | 'Admin' | 'Accountant' | 'InvestmentManager' | 'Viewer' | 'Investor';

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Suspended';
  riskProfile: 'Low' | 'Medium' | 'High';
  targetRoi: number; // annual percentage e.g., 25
  duration: number; // in months
  onboardingDate: string; // YYYY-MM-DD
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  notes: string;
  agreements: string[]; // Document titles
  allocation: { [portfolioId: string]: number }; // e.g. { 'forex': 40, 'futures': 40, 'books': 20 }
}

export type TransactionType =
  | 'Deposit'
  | 'Withdrawal'
  | 'Transfer'
  | 'Borrow'
  | 'Repayment'
  | 'Profit'
  | 'Loss'
  | 'Expense'
  | 'Adjustment';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // in Naira (₦)
  timestamp: string; // ISO String
  investorId?: string; // If related to an investor
  portfolioId?: string; // If related to a portfolio
  borrowId?: string; // If related to an internal borrowing
  personal: boolean; // true = Personal finance, false = Investor pool
  category?: string; // e.g., "Consulting", "Software", "Salary", "Food" for Personal, or "Management Fee" for Pool
  description: string;
  reference: string; // Immutable audit hash
}

export interface Portfolio {
  id: string;
  name: string;
  category: string;
  currentCapital: number;
  availableCash: number;
  openPositions: number;
  closedPositions: number;
  pnl: number; // total profit/loss
  roi: number; // percentage
  winRate: number; // percentage
  drawdown: number; // percentage
  historicalPerformance: { date: string; value: number }[];
}

export interface Borrowing {
  id: string;
  source: 'Personal' | 'Business' | 'Investor Pool';
  destination: 'Personal' | 'Business' | 'Investor Pool';
  amount: number;
  date: string;
  purpose: string;
  expectedReturnDate: string;
  status: 'Outstanding' | 'Due' | 'Late' | 'Completed';
  notes: string;
}

export interface WeeklySnapshot {
  id: string;
  weekEnding: string; // YYYY-MM-DD (Friday)
  portfolioPnL: { [portfolioId: string]: number };
  cashPosition: number;
  totalInvestorBalances: number;
  totalLosses: number;
  totalFees: number;
  totalExpenses: number;
  totalBorrowings: number;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'maturity' | 'repayment' | 'meeting' | 'review' | 'tax' | 'subscription';
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
}

export interface FinancialSummary {
  assetsUnderManagement: number;
  personalNetWorth: number;
  cashPosition: number;
  poolCash: number;
  personalCash: number;
  currentProfit: number;
  currentLoss: number;
  outstandingBorrowing: number;
  expectedPayouts: number;
  upcomingMaturityCount: number;
}
