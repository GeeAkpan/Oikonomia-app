import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import {
  initialInvestors,
  initialPortfolios,
  initialTransactions,
  initialBorrowings,
  initialSnapshots,
  initialTasks,
  initialCalendarEvents,
  initialNotifications
} from './src/data/initialState.js';

const PORT = 3000;
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(process.cwd(), 'db.json');

// Initialize local JSON DB if not exists (Defaults to clean slate for actual use)
function getInitialState() {
  const cleanPortfolios = [
    { id: 'forex', name: 'Forex Bot Auto-Trader', category: 'Forex Bot', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'futures', name: 'High-Leverage Futures Trading', category: 'Futures Trading', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'spot', name: 'Bluechip Spot Accumulation', category: 'Spot Trading', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'memecoins', name: 'Degenerate Memecoin Alpha', category: 'Memecoins', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'books', name: 'Gumroad Book Publishing', category: 'Books', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'real_estate', name: 'Lekki Land Flip Deal', category: 'Real Estate', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] },
    { id: 'stocks', name: 'US Tech Equities Portfolio', category: 'Stocks', currentCapital: 0, availableCash: 0, openPositions: 0, closedPositions: 0, pnl: 0, roi: 0, winRate: 0, drawdown: 0, historicalPerformance: [] }
  ];
  return {
    investors: [],
    portfolios: cleanPortfolios,
    transactions: [],
    borrowings: [],
    snapshots: [],
    tasks: [],
    calendarEvents: [],
    notifications: []
  };
}

function getDemoState() {
  return {
    investors: initialInvestors,
    portfolios: initialPortfolios,
    transactions: initialTransactions,
    borrowings: initialBorrowings,
    snapshots: initialSnapshots,
    tasks: initialTasks,
    calendarEvents: initialCalendarEvents,
    notifications: initialNotifications
  };
}

function loadState() {
  try {
    if (process.env.VERCEL && !fs.existsSync(DB_FILE)) {
      const bundledDb = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(bundledDb)) {
        fs.writeFileSync(DB_FILE, fs.readFileSync(bundledDb, 'utf-8'), 'utf-8');
      } else {
        // Fallback to initial state if db.json is missing in Vercel bundle
        fs.writeFileSync(DB_FILE, JSON.stringify(getInitialState(), null, 2), 'utf-8');
      }
    }
    if (!fs.existsSync(DB_FILE)) {
      // Create local initial DB if it does not exist
      fs.writeFileSync(DB_FILE, JSON.stringify(getInitialState(), null, 2), 'utf-8');
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load DB file, using initial state:', e);
    return getInitialState();
  }
}

function saveState(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write DB file:', e);
  }
}

// Lazy Gemini client builder to avoid crashing if GEMINI_API_KEY is not defined at startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing. Please add it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const app = express();
app.use(express.json());

  // API - Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API - Load financial state with DERIVED calculations
  app.get('/api/state', (req, res) => {
    const state = loadState();

    // 1. Calculate Investor Balances dynamically from Transactions
    const updatedInvestors = state.investors.map((inv: any) => {
      let balance = 0;
      let totalInvested = 0;
      let totalWithdrawn = 0;
      let totalProfitAllocated = 0;

      // Filter transactions related to this investor
      const invTxs = state.transactions.filter((tx: any) => tx.investorId === inv.id);

      invTxs.forEach((tx: any) => {
        if (tx.type === 'Deposit') {
          balance += tx.amount;
          totalInvested += tx.amount;
        } else if (tx.type === 'Withdrawal') {
          balance -= tx.amount;
          totalWithdrawn += tx.amount;
        } else if (tx.type === 'Profit') {
          balance += tx.amount;
          totalProfitAllocated += tx.amount;
        } else if (tx.type === 'Loss') {
          balance -= tx.amount;
        } else if (tx.type === 'Adjustment') {
          balance += tx.amount; // Adjustment can be positive or negative
        }
      });

      // ROI calculation
      const currentRoi = totalInvested > 0 ? (totalProfitAllocated / totalInvested) * 100 : 0;

      return {
        ...inv,
        currentBalance: balance,
        totalInvested,
        totalWithdrawn,
        totalProfitAllocated,
        currentRoi: parseFloat(currentRoi.toFixed(1))
      };
    });

    // 2. Calculate Portfolio values dynamically
    const updatedPortfolios = state.portfolios.map((port: any) => {
      // Base capital is starting value
      let currentCapital = port.currentCapital;
      const portTxs = state.transactions.filter((tx: any) => tx.portfolioId === port.id);

      let pnl = 0;
      portTxs.forEach((tx: any) => {
        if (tx.type === 'Profit') {
          pnl += tx.amount;
        } else if (tx.type === 'Loss') {
          pnl -= tx.amount;
        } else if (tx.type === 'Transfer') {
          currentCapital += tx.amount; // cash assigned
        }
      });

      const roi = currentCapital > 0 ? (pnl / currentCapital) * 100 : 0;

      return {
        ...port,
        currentCapital,
        pnl,
        roi: parseFloat(roi.toFixed(1))
      };
    });

    // 3. Compute Personal cash vs Investor Pool cash
    let personalCash = 0;
    let poolCash = 0;

    state.transactions.forEach((tx: any) => {
      if (tx.personal) {
        if (tx.type === 'Deposit') {
          personalCash += tx.amount;
        } else if (tx.type === 'Expense') {
          personalCash -= tx.amount;
        } else if (tx.type === 'Repayment') {
          personalCash -= tx.amount; // Personal repaid to pool
        } else if (tx.type === 'Borrow') {
          personalCash += tx.amount; // Personal borrowed from pool
        }
      } else {
        // Pool Transactions
        if (tx.type === 'Deposit') {
          poolCash += tx.amount;
        } else if (tx.type === 'Withdrawal') {
          poolCash -= tx.amount;
        } else if (tx.type === 'Transfer') {
          poolCash -= tx.amount; // Cash deployed to portfolio
        } else if (tx.type === 'Borrow') {
          poolCash -= tx.amount; // Borrowed out from pool
        } else if (tx.type === 'Repayment') {
          poolCash += tx.amount; // Repaid back into pool
        } else if (tx.type === 'Profit') {
          poolCash += tx.amount; // Received profits
        } else if (tx.type === 'Loss') {
          poolCash -= tx.amount; // Lost capital
        }
      }
    });

    // 4. Personal Liabilities (Outstanding internal borrows where destination is Personal)
    let personalLiabilities = 0;
    state.borrowings.forEach((b: any) => {
      if (b.destination === 'Personal' && (b.status === 'Outstanding' || b.status === 'Late')) {
        personalLiabilities += b.amount;
      }
    });

    // 5. Personal Net Worth (Personal Cash + Personal Investments)
    const personalNetWorth = personalCash - personalLiabilities;

    // 6. Assets Under Management (AUM) = Sum of active investor balances
    const assetsUnderManagement = updatedInvestors
      .filter((inv: any) => inv.status === 'Active')
      .reduce((sum: number, inv: any) => sum + inv.currentBalance, 0);

    // 7. Outstanding borrowings
    const outstandingBorrowing = state.borrowings
      .filter((b: any) => b.status === 'Outstanding' || b.status === 'Late')
      .reduce((sum: number, b: any) => sum + b.amount, 0);

    // 8. Upcoming maturities and payouts
    const upcomingMaturityCount = state.calendarEvents.filter((ev: any) => {
      const eventDate = new Date(ev.date);
      const today = new Date('2026-07-20');
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return ev.type === 'maturity' && diffDays >= 0 && diffDays <= 7;
    }).length;

    // Expected Payouts: sum of active balances maturing soon
    const expectedPayouts = updatedInvestors
      .filter((inv: any) => inv.status === 'Active')
      .reduce((sum: number, inv: any) => sum + (inv.currentBalance * (inv.targetRoi / 100)), 0);

    const summary = {
      assetsUnderManagement,
      personalNetWorth,
      cashPosition: poolCash + personalCash,
      poolCash,
      personalCash,
      currentProfit: updatedPortfolios.reduce((sum: number, p: any) => sum + (p.pnl > 0 ? p.pnl : 0), 0),
      currentLoss: Math.abs(updatedPortfolios.reduce((sum: number, p: any) => sum + (p.pnl < 0 ? p.pnl : 0), 0)),
      outstandingBorrowing,
      expectedPayouts,
      upcomingMaturityCount
    };

    res.json({
      investors: updatedInvestors,
      portfolios: updatedPortfolios,
      transactions: state.transactions,
      borrowings: state.borrowings,
      snapshots: state.snapshots,
      tasks: state.tasks,
      calendarEvents: state.calendarEvents,
      notifications: state.notifications,
      summary
    });
  });

  // API - Reset or Clear state (Clean Slate vs Demo Data)
  app.post('/api/state/reset', (req, res) => {
    const { mode } = req.body;
    let newState: any;

    if (mode === 'clean') {
      newState = getInitialState();
    } else {
      newState = getDemoState();
    }

    saveState(newState);
    res.json({ success: true, message: `Database successfully reset to ${mode} state.` });
  });

  // API - Add transaction to ledger
  app.post('/api/transactions', (req, res) => {
    const state = loadState();
    const { type, amount, investorId, portfolioId, borrowId, personal, category, description } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ error: 'Type and amount are required' });
    }

    const refHash = 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newTx = {
      id: 'tx-' + Date.now(),
      type,
      amount: parseFloat(amount),
      timestamp: new Date().toISOString(),
      investorId,
      portfolioId,
      borrowId,
      personal: !!personal,
      category,
      description,
      reference: refHash
    };

    state.transactions.push(newTx);

    // Dynamic state additions/adjustments
    if (portfolioId && (type === 'Profit' || type === 'Loss')) {
      const pIndex = state.portfolios.findIndex((p: any) => p.id === portfolioId);
      if (pIndex !== -1) {
        const factor = type === 'Profit' ? 1 : -1;
        state.portfolios[pIndex].pnl += parseFloat(amount) * factor;
      }
    }

    saveState(state);
    res.json({ success: true, transaction: newTx });
  });

  // API - Create investor
  app.post('/api/investors', (req, res) => {
    const state = loadState();
    const investorData = req.body;

    if (!investorData.name || !investorData.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newInvestor = {
      id: investorData.id || 'inv-' + Date.now(),
      name: investorData.name,
      email: investorData.email,
      phone: investorData.phone || '',
      status: investorData.status || 'Active',
      riskProfile: investorData.riskProfile || 'Medium',
      targetRoi: parseFloat(investorData.targetRoi || 20),
      duration: parseInt(investorData.duration || 12),
      onboardingDate: investorData.onboardingDate || new Date().toISOString().split('T')[0],
      kycStatus: investorData.kycStatus || 'Pending',
      notes: investorData.notes || '',
      agreements: investorData.agreements || [],
      allocation: investorData.allocation || { 'forex': 50, 'futures': 50 }
    };

    const index = state.investors.findIndex((i: any) => i.id === newInvestor.id);
    if (index !== -1) {
      state.investors[index] = newInvestor;
    } else {
      state.investors.push(newInvestor);
      // Create initial deposit transaction if specified
      if (investorData.initialDeposit && parseFloat(investorData.initialDeposit) > 0) {
        const depositAmount = parseFloat(investorData.initialDeposit);
        const refHash = 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase();
        state.transactions.push({
          id: 'tx-' + Date.now() + '-dep',
          type: 'Deposit',
          amount: depositAmount,
          timestamp: new Date().toISOString(),
          investorId: newInvestor.id,
          personal: false,
          description: `${newInvestor.name} - Initial capital deployment`,
          reference: refHash
        });

        // Generate transfers based on allocation
        Object.entries(newInvestor.allocation).forEach(([portId, percentage]: [string, any]) => {
          const allocAmount = (depositAmount * (parseFloat(percentage) / 100));
          if (allocAmount > 0) {
            state.transactions.push({
              id: `tx-${Date.now()}-alloc-${portId}`,
              type: 'Transfer',
              amount: allocAmount,
              timestamp: new Date().toISOString(),
              portfolioId: portId,
              personal: false,
              description: `Allocation: ${newInvestor.name} (${percentage}% to ${portId})`,
              reference: 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase()
            });
          }
        });
      }
    }

    saveState(state);
    res.json({ success: true, investor: newInvestor });
  });

  // API - Create Internal Borrowing
  app.post('/api/borrowings', (req, res) => {
    const state = loadState();
    const { source, destination, amount, purpose, expectedReturnDate, notes } = req.body;

    if (!source || !destination || !amount) {
      return res.status(400).json({ error: 'Source, destination, and amount are required' });
    }

    const borrowId = 'borrow-' + Date.now();
    const newBorrow = {
      id: borrowId,
      source,
      destination,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      purpose,
      expectedReturnDate,
      status: 'Outstanding',
      notes: notes || ''
    };

    state.borrowings.push(newBorrow);

    // Create Transfer/Borrow transaction to ledger
    const refHash = 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase();
    state.transactions.push({
      id: 'tx-' + Date.now() + '-b',
      type: 'Borrow',
      amount: parseFloat(amount),
      timestamp: new Date().toISOString(),
      borrowId,
      personal: source === 'Personal' || destination === 'Personal',
      description: `Internal Borrow: ₦${parseFloat(amount).toLocaleString()} from ${source} to ${destination}`,
      reference: refHash
    });

    // Also add to Calendar
    state.calendarEvents.push({
      id: 'cal-' + Date.now(),
      title: `Internal Repayment Due (₦${parseFloat(amount).toLocaleString()})`,
      date: expectedReturnDate,
      type: 'repayment',
      description: `Return of ₦${parseFloat(amount).toLocaleString()} borrowed from ${source} for: ${purpose}`
    });

    saveState(state);
    res.json({ success: true, borrowing: newBorrow });
  });

  // API - Repay Borrowing
  app.post('/api/borrowings/repay', (req, res) => {
    const state = loadState();
    const { borrowId, amount, notes } = req.body;

    const bIndex = state.borrowings.findIndex((b: any) => b.id === borrowId);
    if (bIndex === -1) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    const b = state.borrowings[bIndex];
    const repayAmount = parseFloat(amount);

    // Record repayment transaction
    const refHash = 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase();
    state.transactions.push({
      id: 'tx-' + Date.now() + '-r',
      type: 'Repayment',
      amount: repayAmount,
      timestamp: new Date().toISOString(),
      borrowId,
      personal: b.source === 'Personal' || b.destination === 'Personal',
      description: `Internal Repayment: ₦${repayAmount.toLocaleString()} paid back for borrow ${b.id}`,
      reference: refHash
    });

    // Update borrowing status
    if (repayAmount >= b.amount) {
      state.borrowings[bIndex].status = 'Completed';
    } else {
      state.borrowings[bIndex].notes = `Partial repayment of ₦${repayAmount.toLocaleString()} received. Outstanding: ₦${(b.amount - repayAmount).toLocaleString()}. ${notes || ''}`;
    }

    saveState(state);
    res.json({ success: true, borrowing: state.borrowings[bIndex] });
  });

  // API - Weekly Closing Snapshot
  app.post('/api/weekly-close', (req, res) => {
    const state = loadState();
    const { weekEnding, notes, fees, expenses } = req.body;

    // Perform snapshot calculations
    const portfolioPnL: { [key: string]: number } = {};
    state.portfolios.forEach((p: any) => {
      portfolioPnL[p.id] = p.pnl;
    });

    // Derived cash position
    let personalCash = 0;
    let poolCash = 0;
    state.transactions.forEach((tx: any) => {
      if (tx.personal) {
        if (tx.type === 'Deposit') personalCash += tx.amount;
        else if (tx.type === 'Expense') personalCash -= tx.amount;
      } else {
        if (tx.type === 'Deposit') poolCash += tx.amount;
        else if (tx.type === 'Withdrawal') poolCash -= tx.amount;
        else if (tx.type === 'Transfer') poolCash -= tx.amount;
        else if (tx.type === 'Borrow') poolCash -= tx.amount;
        else if (tx.type === 'Repayment') poolCash += tx.amount;
        else if (tx.type === 'Profit') poolCash += tx.amount;
        else if (tx.type === 'Loss') poolCash -= tx.amount;
      }
    });

    const totalInvestorBalances = state.investors
      .filter((i: any) => i.status === 'Active')
      .reduce((sum: number, i: any) => sum + (i.currentBalance || 100000), 0); // fallback or computed balance

    const newSnapshot = {
      id: 'snap-' + Date.now(),
      weekEnding: weekEnding || new Date().toISOString().split('T')[0],
      portfolioPnL,
      cashPosition: poolCash + personalCash,
      totalInvestorBalances,
      totalLosses: Math.abs(state.portfolios.reduce((sum: number, p: any) => sum + (p.pnl < 0 ? p.pnl : 0), 0)),
      totalFees: parseFloat(fees || 0),
      totalExpenses: parseFloat(expenses || 0),
      totalBorrowings: state.borrowings
        .filter((b: any) => b.status === 'Outstanding' || b.status === 'Late')
        .reduce((sum: number, b: any) => sum + b.amount, 0),
      notes: notes || 'Weekly close successful.'
    };

    state.snapshots.push(newSnapshot);

    // Create transaction log of the close
    state.transactions.push({
      id: 'tx-' + Date.now() + '-wc',
      type: 'Adjustment',
      amount: -parseFloat(expenses || 0),
      timestamp: new Date().toISOString(),
      personal: false,
      category: 'Operations',
      description: `Weekly Closing Snapshot - Fees & Expenses Applied for week ending ${newSnapshot.weekEnding}`,
      reference: 'TX_MD5_' + Math.random().toString(36).substring(2, 7).toUpperCase()
    });

    saveState(state);
    res.json({ success: true, snapshot: newSnapshot });
  });

  // API - Manage Tasks
  app.post('/api/tasks', (req, res) => {
    const state = loadState();
    const { action, id, title, dueDate, priority, category } = req.body;

    if (action === 'toggle') {
      const idx = state.tasks.findIndex((t: any) => t.id === id);
      if (idx !== -1) {
        state.tasks[idx].completed = !state.tasks[idx].completed;
      }
    } else if (action === 'create') {
      state.tasks.push({
        id: 'task-' + Date.now(),
        title,
        completed: false,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        priority: priority || 'Medium',
        category: category || 'General'
      });
    }

    saveState(state);
    res.json({ success: true, tasks: state.tasks });
  });

  // API - AI Financial Analyst Powered by Gemini-3.5-flash
  app.post('/api/analyze', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      // 1. Get full state and format a rich financial summary context for Gemini
      const state = loadState();

      // Compute simple derived values for context
      const totalAum = state.investors
        .filter((i: any) => i.status === 'Active')
        .reduce((sum: number, i: any) => sum + 1000000, 0); // approximate or detailed in server memory

      const contextText = `
You are ATLAS AI, the chief quantitative risk officer, veteran private equity allocator, and personal finance analyst for a modern capital manager managing money in Naira (₦). 
Below is the live immutable ledger and database of the fund. Analyze the numbers and answer the user's natural language query truthfully, explaining every figure based strictly on the data provided.

--- DATA SUMMARY ---
AUM: ₦${totalAum.toLocaleString()}
Total Investors: ${state.investors.length} (${state.investors.filter((i: any) => i.status === 'Active').length} Active, ${state.investors.filter((i: any) => i.status === 'Pending').length} Pending)
Active Portfolios:
${state.portfolios.map((p: any) => `- ${p.name} (${p.category}): Deployed: ₦${p.currentCapital.toLocaleString()}, PnL: ₦${p.pnl.toLocaleString()}, Win Rate: ${p.winRate}%, Drawdown: ${p.drawdown}%`).join('\n')}

Internal Borrowings:
${state.borrowings.map((b: any) => `- Source: ${b.source} -> Dest: ${b.destination}, Amount: ₦${b.amount.toLocaleString()}, Due: ${b.expectedReturnDate}, Status: ${b.status} (${b.purpose})`).join('\n')}

Active Tasks:
${state.tasks.filter((t: any) => !t.completed).map((t: any) => `- [Due: ${t.dueDate}] ${t.title} (${t.priority} priority)`).join('\n')}

Recent Ledger Transactions:
${state.transactions.slice(-10).map((t: any) => `- [${t.timestamp.split('T')[0]}] Type: ${t.type}, Amount: ₦${t.amount.toLocaleString()}, Personal: ${t.personal}, Desc: ${t.description} (Ref: ${t.reference})`).join('\n')}

--- USER QUERY ---
"${prompt}"

Please respond in professional, friendly display typography. Include markdown bullet points, bold text, and a section outlining risks or cash considerations where relevant. Speak with calm, objective confidence. Do not mention that you were passed a raw JSON context. Act as if you are a real-time terminal assistant right inside their dashboard.
`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contextText
      });

      res.json({ response: response.text });
    } catch (e: any) {
      console.error('AI Analyst failure:', e);
      res.status(500).json({ error: e.message || 'The AI analyst could not be reached. Ensure your API key is correctly saved.' });
    }
  });

  // Vite middleware or static serving depending on environment
  if (!process.env.VERCEL) {
    const startDevOrProdServer = async () => {
      if (process.env.NODE_ENV !== 'production') {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa'
        });
        app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    };

    startDevOrProdServer();
  }

export default app;
