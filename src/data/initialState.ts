import { Investor, Transaction, Portfolio, Borrowing, WeeklySnapshot, Task, CalendarEvent, Notification } from '../types';

export const initialInvestors: Investor[] = [
  {
    id: 'inv-1',
    name: 'Adewale Tinubu',
    email: 'tinubu.a@primeholdings.ng',
    phone: '+234 803 111 2222',
    status: 'Active',
    riskProfile: 'High',
    targetRoi: 35,
    duration: 12,
    onboardingDate: '2026-01-15',
    kycStatus: 'Verified',
    notes: 'Premium investor, prefers high-yield automated portfolios. Prefers quarterly reporting.',
    agreements: ['A.Tinubu_Onboarding_Agreement.pdf', 'Risk_Disclosure_Automated_Forex.pdf'],
    allocation: { forex: 50, futures: 30, spot: 20 }
  },
  {
    id: 'inv-2',
    name: 'Chioma Nnaji',
    email: 'chioma.nnaji@techcapital.io',
    phone: '+234 812 345 6789',
    status: 'Active',
    riskProfile: 'Medium',
    targetRoi: 25,
    duration: 6,
    onboardingDate: '2026-05-10',
    kycStatus: 'Verified',
    notes: 'Former tech executive, focus on passive spot growth and low drawdown.',
    agreements: ['C.Nnaji_Master_Agreement_V2.pdf'],
    allocation: { spot: 60, books: 40 }
  },
  {
    id: 'inv-3',
    name: 'Babajide Kolawole',
    email: 'b.kolawole@lekkihomes.com',
    phone: '+234 909 888 7777',
    status: 'Active',
    riskProfile: 'Medium',
    targetRoi: 20,
    duration: 1,
    onboardingDate: '2026-06-24',
    kycStatus: 'Verified',
    notes: 'Short term capital deployment, specifically targeted for real estate bridge or spot.',
    agreements: ['B.Kolawole_1Month_Bridge_Signed.pdf'],
    allocation: { spot: 100 }
  },
  {
    id: 'inv-4',
    name: 'Fatima Yusuf',
    email: 'fatima.y@yusufgroup.com',
    phone: '+234 805 444 3333',
    status: 'Pending',
    riskProfile: 'Low',
    targetRoi: 18,
    duration: 12,
    onboardingDate: '2026-07-18',
    kycStatus: 'Pending',
    notes: 'Awaiting utility bill confirmation for onboarding verification.',
    agreements: [],
    allocation: { spot: 80, books: 20 }
  }
];

export const initialPortfolios: Portfolio[] = [
  {
    id: 'forex',
    name: 'Forex Bot Auto-Trader',
    category: 'Forex Bot',
    currentCapital: 4000000,
    availableCash: 2500000,
    openPositions: 1500000,
    closedPositions: 84,
    pnl: 850000,
    roi: 21.3,
    winRate: 72.5,
    drawdown: 4.8,
    historicalPerformance: [
      { date: 'Wk 24', value: 3100000 },
      { date: 'Wk 25', value: 3500000 },
      { date: 'Wk 26', value: 4150000 },
      { date: 'Wk 27', value: 4850000 }
    ]
  },
  {
    id: 'futures',
    name: 'High-Leverage Futures Trading',
    category: 'Futures Trading',
    currentCapital: 4000000,
    availableCash: 1200000,
    openPositions: 2800000,
    closedPositions: 156,
    pnl: 450000,
    roi: 11.3,
    winRate: 64.2,
    drawdown: 14.5,
    historicalPerformance: [
      { date: 'Wk 24', value: 3800000 },
      { date: 'Wk 25', value: 4100000 },
      { date: 'Wk 26', value: 4350000 },
      { date: 'Wk 27', value: 4450000 }
    ]
  },
  {
    id: 'spot',
    name: 'Bluechip Spot Accumulation',
    category: 'Spot Trading',
    currentCapital: 3000000,
    availableCash: 3000000,
    openPositions: 0,
    closedPositions: 12,
    pnl: 0,
    roi: 0,
    winRate: 100,
    drawdown: 2.1,
    historicalPerformance: [
      { date: 'Wk 24', value: 2000000 },
      { date: 'Wk 25', value: 2500000 },
      { date: 'Wk 26', value: 2800000 },
      { date: 'Wk 27', value: 3000000 }
    ]
  },
  {
    id: 'memecoins',
    name: 'Degenerate Memecoin Alpha',
    category: 'Memecoins',
    currentCapital: 500000,
    availableCash: 200000,
    openPositions: 300000,
    closedPositions: 45,
    pnl: -100000,
    roi: -20.0,
    winRate: 41.5,
    drawdown: 38.2,
    historicalPerformance: [
      { date: 'Wk 24', value: 400000 },
      { date: 'Wk 25', value: 600000 },
      { date: 'Wk 26', value: 450000 },
      { date: 'Wk 27', value: 400000 }
    ]
  },
  {
    id: 'books',
    name: 'Gumroad Book Publishing',
    category: 'Books',
    currentCapital: 1000000,
    availableCash: 1000000,
    openPositions: 0,
    closedPositions: 0,
    pnl: 0,
    roi: 0,
    winRate: 100,
    drawdown: 0,
    historicalPerformance: [
      { date: 'Wk 24', value: 800000 },
      { date: 'Wk 25', value: 900000 },
      { date: 'Wk 26', value: 950000 },
      { date: 'Wk 27', value: 1000000 }
    ]
  },
  {
    id: 'real_estate',
    name: 'Lekki Land Flip Deal',
    category: 'Real Estate',
    currentCapital: 0,
    availableCash: 0,
    openPositions: 0,
    closedPositions: 0,
    pnl: 0,
    roi: 0,
    winRate: 0,
    drawdown: 0,
    historicalPerformance: []
  },
  {
    id: 'stocks',
    name: 'US Tech Equities Portfolio',
    category: 'Stocks',
    currentCapital: 0,
    availableCash: 0,
    openPositions: 0,
    closedPositions: 0,
    pnl: 0,
    roi: 0,
    winRate: 0,
    drawdown: 0,
    historicalPerformance: []
  }
];

export const initialTransactions: Transaction[] = [
  // 1. Investor Deposits
  {
    id: 'tx-1',
    type: 'Deposit',
    amount: 5000000,
    timestamp: '2026-06-01T09:00:00.000Z',
    investorId: 'inv-1',
    personal: false,
    category: 'Investment Deposit',
    description: 'Initial deposit from Adewale Tinubu',
    reference: '0x9d111222'
  },
  {
    id: 'tx-2',
    type: 'Deposit',
    amount: 3000000,
    timestamp: '2026-06-15T11:30:00.000Z',
    investorId: 'inv-2',
    personal: false,
    category: 'Investment Deposit',
    description: 'Initial deposit from Chioma Nnaji',
    reference: '0x3456789a'
  },
  {
    id: 'tx-3',
    type: 'Deposit',
    amount: 8000000,
    timestamp: '2026-07-01T10:15:00.000Z',
    investorId: 'inv-3',
    personal: false,
    category: 'Investment Deposit',
    description: 'Bridge capital deposit from Babajide Kolawole',
    reference: '0x8887777b'
  },

  // 2. Capital Deployments (Transfers out of Investor Pool to Portfolios)
  {
    id: 'tx-4',
    type: 'Transfer',
    amount: 4000000,
    timestamp: '2026-06-02T10:00:00.000Z',
    portfolioId: 'forex',
    personal: false,
    category: 'Capital Deployment',
    description: 'Capital deployed to Forex Bot Auto-Trader',
    reference: '0xf01e23f'
  },
  {
    id: 'tx-5',
    type: 'Transfer',
    amount: 4000000,
    timestamp: '2026-06-03T10:00:00.000Z',
    portfolioId: 'futures',
    personal: false,
    category: 'Capital Deployment',
    description: 'Capital deployed to High-Leverage Futures Trading',
    reference: '0xf12a34b'
  },
  {
    id: 'tx-6',
    type: 'Transfer',
    amount: 3000000,
    timestamp: '2026-06-16T12:00:00.000Z',
    portfolioId: 'spot',
    personal: false,
    category: 'Capital Deployment',
    description: 'Capital deployed to Bluechip Spot Accumulation',
    reference: '0xf56a78b'
  },
  {
    id: 'tx-7',
    type: 'Transfer',
    amount: 1000000,
    timestamp: '2026-06-20T14:00:00.000Z',
    portfolioId: 'books',
    personal: false,
    category: 'Capital Deployment',
    description: 'Capital deployed to Gumroad Book Publishing',
    reference: '0xf88a77b'
  },
  {
    id: 'tx-8',
    type: 'Transfer',
    amount: 500000,
    timestamp: '2026-07-02T15:00:00.000Z',
    portfolioId: 'memecoins',
    personal: false,
    category: 'Capital Deployment',
    description: 'Capital deployed to Degenerate Memecoin Alpha',
    reference: '0xf33a44b'
  },

  // 3. Profits and Losses
  {
    id: 'tx-9',
    type: 'Profit',
    amount: 250000,
    timestamp: '2026-06-30T17:00:00.000Z',
    investorId: 'inv-1',
    portfolioId: 'forex',
    personal: false,
    category: 'Profit Allocation',
    description: 'Monthly Forex Bot payout allocation (Quarterly Option)',
    reference: '0x99e1112'
  },
  {
    id: 'tx-10',
    type: 'Profit',
    amount: 600000,
    timestamp: '2026-06-28T16:00:00.000Z',
    portfolioId: 'forex',
    personal: false,
    category: 'Profit Yield',
    description: 'Forex bot automated trade profits',
    reference: '0x550a112'
  },
  {
    id: 'tx-11',
    type: 'Profit',
    amount: 450000,
    timestamp: '2026-07-10T16:00:00.000Z',
    portfolioId: 'futures',
    personal: false,
    category: 'Profit Yield',
    description: 'Futures short momentum scalp profits',
    reference: '0x650a333'
  },
  {
    id: 'tx-12',
    type: 'Loss',
    amount: 100000,
    timestamp: '2026-07-15T18:00:00.000Z',
    portfolioId: 'memecoins',
    personal: false,
    category: 'Loss Write-off',
    description: 'Liquidation of high-risk memecoin position',
    reference: '0x150b888'
  },

  // 4. Internal Pool Borrowings
  {
    id: 'tx-13',
    type: 'Borrow',
    amount: 500000,
    timestamp: '2026-07-10T11:00:00.000Z',
    personal: false,
    category: 'Internal Borrowing',
    description: 'Loan to Owner Personal Account',
    reference: '0x111b222'
  },

  // 5. Personal Finance Transactions
  {
    id: 'tx-14',
    type: 'Deposit',
    amount: 2000000,
    timestamp: '2026-06-10T09:00:00.000Z',
    personal: true,
    category: 'Capital Injection',
    description: 'Owner personal savings injection',
    reference: '0x9222333'
  },
  {
    id: 'tx-15',
    type: 'Expense',
    amount: 150000,
    timestamp: '2026-06-25T10:00:00.000Z',
    personal: true,
    category: 'Software',
    description: 'Subscription fees: TradingView & Vultr VPS',
    reference: '0x8150223'
  },
  {
    id: 'tx-16',
    type: 'Expense',
    amount: 85000,
    timestamp: '2026-07-05T12:00:00.000Z',
    personal: true,
    category: 'Legal / Consulting',
    description: 'Lekki land registry title search fee',
    reference: '0x8850111'
  },
  {
    id: 'tx-17',
    type: 'Borrow',
    amount: 500000,
    timestamp: '2026-07-10T11:00:00.000Z',
    personal: true,
    category: 'Internal Borrowing',
    description: 'Loan received from Investor Pool',
    reference: '0x222b333'
  }
];

export const initialBorrowings: Borrowing[] = [
  {
    id: 'borrow-1',
    source: 'Investor Pool',
    destination: 'Personal',
    amount: 500000,
    date: '2026-07-10',
    purpose: 'Emergency personal cash bridge',
    expectedReturnDate: '2026-08-10',
    status: 'Outstanding',
    notes: 'Interest-free short-term transfer from pool to personal account. Will repay from personal dividends.'
  },
  {
    id: 'borrow-2',
    source: 'Personal',
    destination: 'Business',
    amount: 300000,
    date: '2026-05-01',
    purpose: 'Vite dev environment setup cost',
    expectedReturnDate: '2026-06-01',
    status: 'Completed',
    notes: 'Paid back in full from first-month publishing revenue.'
  }
];

export const initialSnapshots: WeeklySnapshot[] = [
  {
    id: 'snap-26',
    weekEnding: '2026-07-03',
    portfolioPnL: {
      forex: 450000,
      futures: 200000,
      spot: 150000,
      memecoins: 50000,
      books: 80000,
      real_estate: 0,
      stocks: 120000
    },
    cashPosition: 12450000,
    totalInvestorBalances: 14250000,
    totalLosses: 20000,
    totalFees: 150000,
    totalExpenses: 45000,
    totalBorrowings: 0,
    notes: 'End of Week 26. Solid forex automated trade results. Stable spot trends.'
  },
  {
    id: 'snap-27',
    weekEnding: '2026-07-10',
    portfolioPnL: {
      forex: 600000,
      futures: 380000,
      spot: 220000,
      memecoins: -40000,
      books: 110000,
      real_estate: 0,
      stocks: 140000
    },
    cashPosition: 13800000,
    totalInvestorBalances: 15100000,
    totalLosses: 40000,
    totalFees: 220000,
    totalExpenses: 85000,
    totalBorrowings: 500000,
    notes: 'End of Week 27. Futures volatility allowed solid scalping. Added bridge borrowing.'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: "Verify Fatima Yusuf's utility bill KYC documents",
    completed: false,
    dueDate: '2026-07-22',
    priority: 'High',
    category: 'Compliance'
  },
  {
    id: 'task-2',
    title: 'Distribute Forex bot weekly profit payout allocation reports',
    completed: true,
    dueDate: '2026-07-18',
    priority: 'High',
    category: 'Finance'
  },
  {
    id: 'task-3',
    title: 'Update Gumroad book dashboard statistics and check payout schedule',
    completed: false,
    dueDate: '2026-07-25',
    priority: 'Medium',
    category: 'Operations'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Babajide Kolawole Maturity Date',
    date: '2026-07-24',
    type: 'maturity',
    description: '1-month short-term spot accumulation pool maturity payout.'
  },
  {
    id: 'evt-2',
    title: 'Lekki Land Instalment Repayment',
    date: '2026-07-28',
    type: 'repayment',
    description: 'Quarterly instalment payment due for Lekki property flip deal.'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'KYC Document Received',
    message: 'Fatima Yusuf uploaded passport photograph and driver license.',
    type: 'info',
    timestamp: '2026-07-20T10:00:00.000Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Upcoming Maturity Warning',
    message: 'Babajide Kolawole allocation is due for payout in 4 days.',
    type: 'warning',
    timestamp: '2026-07-20T08:00:00.000Z',
    read: false
  }
];
