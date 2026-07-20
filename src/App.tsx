import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import InvestorCrmView from './components/InvestorCrmView';
import LedgerView from './components/LedgerView';
import PortfolioView from './components/PortfolioView';
import BorrowingView from './components/BorrowingView';
import WeeklyCloseView from './components/WeeklyCloseView';
import AiAnalystView from './components/AiAnalystView';
import TasksCalendarView from './components/TasksCalendarView';
import FloatingActionButton from './components/FloatingActionButton';
import MobileBottomNav from './components/MobileBottomNav';
import { Investor, Portfolio, Transaction, Borrowing, WeeklySnapshot, Task, CalendarEvent, Notification, FinancialSummary, UserRole } from './types';

export default function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [role, setRole] = useState<UserRole>('Owner'); // Default role: Owner
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Core database states
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [snapshots, setSnapshots] = useState<WeeklySnapshot[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dbMode, setDbMode] = useState<'clean' | 'demo'>('demo');
  const [summary, setSummary] = useState<FinancialSummary>({
    assetsUnderManagement: 0,
    personalNetWorth: 0,
    cashPosition: 0,
    poolCash: 0,
    personalCash: 0,
    currentProfit: 0,
    currentLoss: 0,
    outstandingBorrowing: 0,
    expectedPayouts: 0,
    upcomingMaturityCount: 0
  });

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Failed to load application ledger state.');
      const data = await res.json();
      setInvestors(data.investors);
      setPortfolios(data.portfolios);
      setTransactions(data.transactions);
      setBorrowings(data.borrowings);
      setSnapshots(data.snapshots);
      setTasks(data.tasks);
      setCalendarEvents(data.calendarEvents);
      setNotifications(data.notifications);
      setSummary(data.summary);
      
      if (data.investors.length === 0 && data.transactions.length === 0) {
        setDbMode('clean');
      } else {
        setDbMode('demo');
      }
      
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Error occurred while establishing database connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetState = async (mode: 'clean' | 'demo') => {
    try {
      setLoading(true);
      const res = await fetch('/api/state/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      if (!res.ok) throw new Error('Failed to reset system database.');
      setDbMode(mode);
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleAddInvestor = async (investorData: any) => {
    try {
      const res = await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investorData)
      });
      if (!res.ok) throw new Error('Failed to onboard investor.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePostTransaction = async (txData: any) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData)
      });
      if (!res.ok) throw new Error('Failed to record transaction entry.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePostBorrowing = async (borrowData: any) => {
    try {
      const res = await fetch('/api/borrowings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(borrowData)
      });
      if (!res.ok) throw new Error('Failed to approve borrowing shift.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRepayBorrowing = async (repayData: any) => {
    try {
      const res = await fetch('/api/borrowings/repay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repayData)
      });
      if (!res.ok) throw new Error('Failed to log borrow return payment.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleWeeklyClose = async (closeData: any) => {
    try {
      const res = await fetch('/api/weekly-close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(closeData)
      });
      if (!res.ok) throw new Error('Failed to record Friday snapshot.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', id: taskId })
      });
      if (!res.ok) throw new Error('Failed to toggle action item.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...taskData })
      });
      if (!res.ok) throw new Error('Failed to create custom task.');
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const renderActiveView = () => {
    switch (activeView.toLowerCase()) {
      case 'dashboard':
        return (
          <DashboardView
            summary={summary}
            portfolios={portfolios}
            transactions={transactions}
            investors={investors}
            tasks={tasks}
            role={role}
            onToggleTask={handleToggleTask}
            onPostQuickTx={handlePostTransaction}
            setActiveTab={setActiveView}
          />
        );
      case 'investors':
        return (
          <InvestorCrmView
            investors={investors}
            portfolios={portfolios}
            transactions={transactions}
            onAddInvestor={handleAddInvestor}
            role={role}
          />
        );
      case 'ledger':
        return (
          <LedgerView
            transactions={transactions}
            investors={investors}
            portfolios={portfolios}
            onPostTransaction={handlePostTransaction}
            role={role}
          />
        );
      case 'portfolios':
      case 'portfolio':
        return (
          <PortfolioView
            portfolios={portfolios}
            investors={investors}
            role={role}
            onPostQuickTx={handlePostTransaction}
          />
        );
      case 'borrowing':
        return (
          <BorrowingView
            borrowings={borrowings}
            role={role}
            onPostBorrowing={handlePostBorrowing}
            onRepayBorrowing={handleRepayBorrowing}
          />
        );
      case 'weeklyclose':
      case 'weekly-close':
        return (
          <WeeklyCloseView
            portfolios={portfolios}
            snapshots={snapshots}
            onWeeklyClose={handleWeeklyClose}
            role={role}
          />
        );
      case 'aianalyst':
      case 'ai-analyst':
        return <AiAnalystView />;
      case 'taskscalendar':
      case 'tasks-calendar':
        return (
          <TasksCalendarView
            tasks={tasks}
            calendarEvents={calendarEvents}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            role={role}
          />
        );
      default:
        return (
          <div className="py-12 text-center text-zinc-500 text-xs">
            Module under active development. Select an option from the sidebar.
          </div>
        );
    }
  };

  if (loading && investors.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center text-xs text-white/40 font-mono gap-3.5">
        <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Syncing unalterable ledgers and risk weights...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center text-xs text-red-400 font-mono gap-3.5 p-6 text-center max-w-md mx-auto">
        <div className="h-10 w-10 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400">
          ⚠️
        </div>
        <span className="font-sans leading-relaxed text-[#e0e2e5]">{error}</span>
        <button
          onClick={fetchState}
          className="px-4 py-2 bg-[#16171a] border border-white/5 rounded-xl hover:bg-white/5 text-white/80 font-sans transition-all cursor-pointer"
        >
          Retry Establish connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-[#e0e2e5] flex overflow-hidden font-sans">
      {/* Role-based Sidebar Navigation */}
      <Sidebar
        activeTab={activeView}
        setActiveTab={setActiveView}
        role={role}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <Header
          role={role}
          setRole={setRole}
          notifications={notifications}
          markAsRead={handleMarkNotificationRead}
          clearNotifications={handleClearNotifications}
          onResetState={handleResetState}
          currentMode={dbMode}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* View container */}
        <main className="flex-grow overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto pb-24">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Action Button Quick Menu */}
      <FloatingActionButton
        role={role}
        investors={investors}
        portfolios={portfolios}
        onAddInvestor={handleAddInvestor}
        onPostTransaction={handlePostTransaction}
        onPostBorrowing={handlePostBorrowing}
      />

      {/* Immersive Mobile Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeView}
        setActiveTab={setActiveView}
        role={role}
        onResetState={handleResetState}
        currentMode={dbMode}
      />
    </div>
  );
}
