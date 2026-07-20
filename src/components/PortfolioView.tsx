import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  Users,
  Target,
  AlertTriangle,
  ArrowRightLeft,
  DollarSign,
  Plus,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Portfolio, Investor } from '../types';

interface PortfolioViewProps {
  portfolios: Portfolio[];
  investors: Investor[];
  role: string;
  onPostQuickTx: (txData: any) => void;
}

export default function PortfolioView({ portfolios, investors, role, onPostQuickTx }: PortfolioViewProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Portfolio Allocations Engine</h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">Track deployed assets, open trades, win rates, drawdowns, and assigned investor capital pools</p>
      </div>

      {/* Grid of portfolios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((port) => {
          // Find investors assigned to this portfolio
          const assignedInvestors = investors.filter((inv) => inv.allocation[port.id] > 0);
          const isNegative = port.pnl < 0;

          return (
            <div
              key={port.id}
              onClick={() => setSelectedPortfolio(port)}
              className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all cursor-pointer group shadow-lg"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded text-zinc-500 border border-zinc-850 uppercase tracking-widest">
                      {port.category}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors font-sans truncate max-w-[180px]">
                      {port.name}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-1 rounded flex items-center gap-1 ${
                      isNegative ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {port.roi}% ROI
                  </span>
                </div>

                {/* Capital Stats */}
                <div className="grid grid-cols-2 gap-4 border-y border-zinc-850 py-3 font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Deployed Capital</span>
                    <span className="text-sm font-black text-zinc-200">
                      {formatNaira(port.currentCapital)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Net PnL Yield</span>
                    <span className={`text-sm font-black ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isNegative ? '-' : '+'}
                      {formatNaira(Math.abs(port.pnl))}
                    </span>
                  </div>
                </div>

                {/* Risk Parameters */}
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                  <div>
                    <span className="text-zinc-500 uppercase block">Win Rate</span>
                    <span className="font-bold text-zinc-300">{port.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase block">Drawdown</span>
                    <span className={`font-bold ${port.drawdown > 15 ? 'text-red-400 font-extrabold' : 'text-zinc-300'}`}>
                      {port.drawdown}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase block">Investors</span>
                    <span className="font-bold text-zinc-300">{assignedInvestors.length} Active</span>
                  </div>
                </div>

                {/* Mini-Area Chart for portfolio historical value */}
                <div className="h-14 w-full pt-2 opacity-85 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={port.historicalPerformance}>
                      <defs>
                        <linearGradient id={`grad-${port.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isNegative ? '#F43F5E' : '#34D399'} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={isNegative ? '#F43F5E' : '#34D399'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={isNegative ? '#F43F5E' : '#34D399'}
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill={`url(#grad-${port.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portfolio Assigned Investors & Control Drawer */}
      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  DEPLOYMENT AUDIT REPORT
                </span>
                <h3 className="text-lg font-bold text-white font-sans">{selectedPortfolio.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                CLOSE REPORT
              </button>
            </div>

            {/* Assigned Investors Grid */}
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users size={14} className="text-emerald-500" />
                  Assigned LPs & Equity Splits
                </h4>

                <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                  {investors
                    .filter((inv) => inv.allocation[selectedPortfolio.id] > 0)
                    .map((inv) => {
                      const sharePercentage = inv.allocation[selectedPortfolio.id];
                      const actualStakedAmount = (selectedPortfolio.currentCapital * (sharePercentage / 100));

                      return (
                        <div
                          key={inv.id}
                          className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-850 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-200">{inv.name}</span>
                            <span className="text-[10px] text-zinc-500">{inv.email}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white block">{formatNaira(actualStakedAmount)}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">{sharePercentage}% share</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Drawdown Risk Warning indicator */}
              {selectedPortfolio.drawdown > 15 && (
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-400 flex gap-2.5 items-start font-sans leading-relaxed">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block uppercase tracking-wider text-[10px] font-mono">
                      DRAWDOWN SAFETY threshold breached
                    </span>
                    <span>
                      The drawdown of {selectedPortfolio.drawdown}% exceeds our recommended 15% private capital risk pool limit. High leverage positions should be closed to preserve capital.
                    </span>
                  </div>
                </div>
              )}

              {/* Performance Metrics Block */}
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-850/80 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-zinc-500 block">Win Rate Probability</span>
                  <span className="font-bold text-zinc-200 text-sm flex items-center gap-1.5">
                    <Target size={14} className="text-blue-500" />
                    {selectedPortfolio.winRate}% (MT4/5 verified)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 block">Historical Positions</span>
                  <span className="font-bold text-zinc-200 text-sm">
                    {selectedPortfolio.openPositions} Open / {selectedPortfolio.closedPositions} Settled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
