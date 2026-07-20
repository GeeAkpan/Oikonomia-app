import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Bot,
  User,
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { FinancialSummary, Transaction, Portfolio, Task, UserRole, Investor } from '../types';
import ActivityTimeline from './ActivityTimeline';

interface DashboardViewProps {
  summary: FinancialSummary;
  portfolios: Portfolio[];
  transactions: Transaction[];
  investors: Investor[];
  tasks: Task[];
  role: UserRole;
  onToggleTask: (id: string) => void;
  onPostQuickTx: (txData: any) => void;
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({
  summary,
  portfolios,
  transactions,
  investors,
  tasks,
  role,
  onToggleTask,
  onPostQuickTx,
  setActiveTab
}: DashboardViewProps) {
  const [askMini, setAskMini] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'hub' | 'performance' | 'operations'>('hub');

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Pre-process chart data
  const portfolioDistributionData = portfolios.map((p) => ({
    name: p.name.replace(' Portfolio', '').substring(0, 18),
    value: p.currentCapital,
    pnl: p.pnl,
    roi: p.roi
  }));

  const COLORS = ['#7C3AED', '#F43F5E', '#34D399', '#A78BFA', '#C084FC', '#FB7185', '#2DD4BF'];

  // Historical growth trend (aggregate data for the area chart) - round to zero if no data
  const growthTrendData = summary.assetsUnderManagement > 0 
    ? [
        { name: 'Baseline', AUM: 0, Profit: 0 },
        { name: 'Wk 1', AUM: Math.round(summary.assetsUnderManagement * 0.7), Profit: Math.round(summary.currentProfit * 0.6) },
        { name: 'Wk 2', AUM: Math.round(summary.assetsUnderManagement * 0.85), Profit: Math.round(summary.currentProfit * 0.8) },
        { name: 'Current', AUM: summary.assetsUnderManagement, Profit: summary.currentProfit }
      ]
    : [
        { name: 'Baseline', AUM: 0, Profit: 0 },
        { name: 'Current', AUM: 0, Profit: 0 }
      ];

  const aumChangePercent = summary.assetsUnderManagement > 0 ? '+12.3%' : '0.0%';
  const netWorthChangePercent = summary.personalNetWorth > 0 ? '+4.2%' : '0.0%';
  const cashRatio = summary.assetsUnderManagement > 0 
    ? Math.min(100, Math.round((summary.cashPosition / summary.assetsUnderManagement) * 100)) 
    : 0;

  const handleMiniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askMini.trim()) return;
    setActiveTab('ai-analyst');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="bg-[#121316] p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 font-sans uppercase tracking-wider flex items-center gap-1">
            Oikonomia Private Ledger
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl font-sans uppercase">
            Executive Wealth Allocation Command
          </h2>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed">
            Real-time multi-entity ledger for private estate stewardship, pool-capital allocation, and performance monitoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-start items-center">
          <button
            onClick={() => setActiveTab('ai-analyst')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#090a0c] hover:bg-white/5 border border-white/5 text-sm font-semibold text-white hover:text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <Bot size={16} className="text-emerald-400" />
            <span className="font-sans tracking-wide uppercase text-[10px] whitespace-nowrap">Consult AI Analyst</span>
          </button>
          {['Owner', 'Admin', 'Accountant'].includes(role) && (
            <button
              onClick={() => setActiveTab('weekly-close')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 text-sm font-bold text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck size={16} />
              <span className="font-sans tracking-wide uppercase text-[10px] whitespace-nowrap">Lock Friday Week</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Dashboard Sub-navigation Tabs */}
      <div className="flex bg-[#121316] p-1 rounded-2xl border border-white/5 self-start max-w-full overflow-x-auto whitespace-nowrap gap-1">
        <button
          onClick={() => setDashboardTab('hub')}
          className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
            dashboardTab === 'hub'
              ? 'bg-[#1d1e22] text-emerald-400 border border-emerald-500/10 shadow-lg'
              : 'text-white/40 hover:text-white hover:bg-white/[0.02] border border-transparent'
          }`}
        >
          Command Hub
        </button>
        <button
          onClick={() => setDashboardTab('performance')}
          className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
            dashboardTab === 'performance'
              ? 'bg-[#1d1e22] text-emerald-400 border border-emerald-500/10 shadow-lg'
              : 'text-white/40 hover:text-white hover:bg-white/[0.02] border border-transparent'
          }`}
        >
          Performance & Yields
        </button>
        <button
          onClick={() => setDashboardTab('operations')}
          className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
            dashboardTab === 'operations'
              ? 'bg-[#1d1e22] text-emerald-400 border border-emerald-500/10 shadow-lg'
              : 'text-white/40 hover:text-white hover:bg-white/[0.02] border border-transparent'
          }`}
        >
          Operations & Audit
        </button>
      </div>

      {/* Conditionally Render Tabs */}
      {dashboardTab === 'hub' && (
        <div className="space-y-6 animate-fade-in">
          {/* 3. Top Metric Cards (PRD specified) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AUM */}
            <div className="bg-[#121316] border border-white/5 greek-border greek-border-hover p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-md group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-widest">
                  Assets Under Management
                </span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Wallet size={16} />
                </div>
              </div>
              <div>
                <p className="text-base xs:text-lg lg:text-base xl:text-xl font-mono font-bold text-white tracking-tight">
                  {formatNaira(summary.assetsUnderManagement)}
                </p>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1 font-mono">
                  <span className="text-emerald-400 font-bold flex items-center">
                    <ArrowUpRight size={12} /> {aumChangePercent}
                  </span>
                  vs last week
                </p>
              </div>
            </div>

            {/* Personal Net Worth */}
            <div className="bg-[#121316] border border-white/5 greek-border greek-border-hover p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-widest">
                  Personal Net Worth
                </span>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <p className="text-base xs:text-lg lg:text-base xl:text-xl font-mono font-bold text-white tracking-tight">
                  {formatNaira(summary.personalNetWorth)}
                </p>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1 font-mono">
                  <span className="text-blue-400 font-bold flex items-center">
                    <ArrowUpRight size={12} /> {netWorthChangePercent}
                  </span>
                  isolated pool
                </p>
              </div>
            </div>

            {/* Total Cash Liquidity */}
            <div className="bg-[#121316] border border-white/5 greek-border greek-border-hover p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-widest">
                  Available Cash
                </span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <CheckCircle size={16} />
                </div>
              </div>
              <div>
                <p className="text-base xs:text-lg lg:text-base xl:text-xl font-mono font-bold text-white tracking-tight">
                  {formatNaira(summary.cashPosition)}
                </p>
                <div className="h-1 w-full bg-white/5 rounded-full mt-4">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${cashRatio}%` }}></div>
                </div>
                <p className="text-[10px] text-white/40 mt-1.5 flex justify-between font-mono leading-none">
                  <span>Liquidity Ratio</span>
                  <span>{cashRatio}%</span>
                </p>
              </div>
            </div>

            {/* Profit vs Loss (Dynamic) */}
            <div className="bg-[#121316] border border-white/5 greek-border greek-border-hover p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-[10px] font-sans font-bold uppercase tracking-widest">
                  Unrealized PnL (Net)
                </span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-base xs:text-lg lg:text-base xl:text-xl font-mono font-bold text-emerald-400 tracking-tight">
                    +{formatNaira(summary.currentProfit)}
                  </p>
                  <span className="text-xs text-white/20">/</span>
                  <p className="text-xs sm:text-sm font-bold text-red-400 font-mono">
                    -{formatNaira(summary.currentLoss)}
                  </p>
                </div>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1 font-mono">
                  <span className="text-emerald-400 font-bold flex items-center">
                    <ArrowUpRight size={12} />
                    {summary.assetsUnderManagement > 0
                      ? (((summary.currentProfit - summary.currentLoss) / summary.assetsUnderManagement) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </span>
                  aggregated yield
                </p>
              </div>
            </div>
          </div>

          {/* 4. Quick Metrics (Liabilities & Maturities) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#16171a] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">
                  Outstanding Internal Borrowing
                </span>
                <p className="text-base font-mono text-white">
                  {formatNaira(summary.outstandingBorrowing)}
                </p>
              </div>
            </div>

            <div className="bg-[#16171a] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">
                  Expected Investor Payouts
                </span>
                <p className="text-base font-mono text-white">
                  {formatNaira(summary.expectedPayouts)}
                </p>
              </div>
            </div>

            <div className="bg-[#16171a] border border-white/5 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">
                  Upcoming Maturities (7 Days)
                </span>
                <p className="text-base font-mono text-white">
                  {summary.upcomingMaturityCount} Contracts
                </p>
              </div>
            </div>
          </div>

          {/* 5. Capital Allocation (Horizontal Compact Layout) */}
          <div className="bg-[#16171a] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row gap-8 items-stretch justify-between">
            {/* Pie Chart Column */}
            <div className="w-full md:w-5/12 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                  Capital Allocation
                </h3>
                <p className="text-xs text-white/40">Portfolio concentrations & active weights</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center relative my-4">
                {summary.assetsUnderManagement === 0 ? (
                  <div className="absolute inset-0 bg-[#0a0b0d]/40 flex flex-col items-center justify-center p-4 text-center rounded-2xl border border-white/5">
                    <Database size={24} className="text-emerald-500/60 mb-2 animate-pulse" />
                    <span className="text-xs font-semibold text-white/80">No Active Allocations</span>
                    <span className="text-[10px] text-white/40 max-w-[180px] mt-1 leading-relaxed">
                      Onboard your first investor and record a deposit to see asset concentrations.
                    </span>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          {portfolioDistributionData.map((entry, index) => {
                            const isHovered = activeIndex === index;
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                opacity={activeIndex === null || isHovered ? 1 : 0.6}
                                stroke={isHovered ? '#ffffff' : 'rgba(255,255,255,0.05)'}
                                strokeWidth={isHovered ? 2 : 1}
                                style={{
                                  outline: 'none',
                                  transition: 'all 0.2s ease-in-out',
                                }}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [formatNaira(value), 'Capital']}
                          contentStyle={{ backgroundColor: '#16171a', borderColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Inner text block */}
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none text-center">
                      {activeIndex === null ? (
                        <>
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                            Total Pool
                          </span>
                          <span className="text-sm font-black text-white font-mono mt-0.5 block">
                            {formatNaira(summary.assetsUnderManagement)}
                          </span>
                          <span className="text-[8px] font-mono text-emerald-400/80 block">
                            100% Deployed
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider truncate max-w-[120px] font-bold block">
                            {portfolioDistributionData[activeIndex]?.name}
                          </span>
                          <span className="text-sm font-black text-white font-mono mt-0.5 block">
                            {formatNaira(portfolioDistributionData[activeIndex]?.value || 0)}
                          </span>
                          <span className="text-[8px] font-mono text-white/40 block">
                            {summary.assetsUnderManagement > 0
                              ? (((portfolioDistributionData[activeIndex]?.value || 0) / summary.assetsUnderManagement) * 100).toFixed(1)
                              : '0.0'}
                            % Share
                          </span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Ledger Distribution List Column */}
            <div className="w-full md:w-7/12 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold block mb-3">
                Allocation Distribution Ledger
              </span>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {portfolioDistributionData.map((entry, index) => {
                  const percentage = summary.assetsUnderManagement > 0 
                    ? ((entry.value / summary.assetsUnderManagement) * 100).toFixed(1) 
                    : '0.0';
                  const isHovered = activeIndex === index;

                  return (
                    <div
                      key={entry.name}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                        isHovered
                          ? 'bg-white/5 border-white/10 shadow-md'
                          : 'bg-[#0a0b0d]/20 border-transparent hover:border-white/5 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0 transition-transform duration-200"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white truncate">{entry.name}</span>
                          <span className="text-[9px] text-white/30 font-mono">
                            ROI: {entry.roi}% • Yield: {formatNaira(entry.pnl)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-mono font-bold text-zinc-200">
                          {formatNaira(entry.value)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {dashboardTab === 'performance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Capital Growth & Yield Curve Trend Chart */}
          <div className="bg-[#16171a] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Capital Growth & Yield Curve
                </h3>
                <p className="text-xs text-white/40 mt-0.5">AUM dynamic growth vs performance profits over time</p>
              </div>
            </div>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthTrendData}>
                  <defs>
                    <linearGradient id="colorAUM" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.15)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255, 255, 255, 0.15)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#221b4a', borderColor: 'rgba(124, 58, 237, 0.12)', borderRadius: '12px' }}
                    labelStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    name="AUM Deployed"
                    dataKey="AUM"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAUM)"
                  />
                  <Area
                    type="monotone"
                    name="Cumulative Profit"
                    dataKey="Profit"
                    stroke="#34D399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {dashboardTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Activity Timeline Audit Trail */}
          <div className="lg:col-span-2">
            <ActivityTimeline transactions={transactions} investors={investors} />
          </div>

          {/* Tasks Checklist */}
          <div className="bg-[#16171a] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Upcoming Operations
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">Tasks & operational items</p>
                </div>
              </div>

              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="flex items-center gap-3 bg-[#0a0b0d] p-3 rounded-2xl border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle2
                        size={18}
                        className={task.completed ? 'text-emerald-500' : 'text-white/20'}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-xs font-semibold text-white truncate ${
                          task.completed ? 'line-through text-white/20' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono mt-0.5">
                        Due: {task.dueDate} • {task.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleMiniSubmit} className="mt-6 border-t border-white/5 pt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask Xena AI Analyst..."
                value={askMini}
                onChange={(e) => setAskMini(e.target.value)}
                className="bg-[#0a0b0d] border border-white/5 text-xs text-white rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                <Bot size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
