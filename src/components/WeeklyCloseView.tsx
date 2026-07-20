import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  FileCheck2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Portfolio, WeeklySnapshot } from '../types';

interface WeeklyCloseViewProps {
  portfolios: Portfolio[];
  snapshots: WeeklySnapshot[];
  onWeeklyClose: (closeData: any) => void;
  role: string;
}

export default function WeeklyCloseView({
  portfolios,
  snapshots,
  onWeeklyClose,
  role
}: WeeklyCloseViewProps) {
  const [step, setStep] = useState(1);
  const [fees, setFees] = useState('15000');
  const [expenses, setExpenses] = useState('25000');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleCloseConfirm = () => {
    onWeeklyClose({
      weekEnding: new Date().toISOString().split('T')[0],
      fees: parseFloat(fees),
      expenses: parseFloat(expenses),
      notes: notes || `Standard Weekly Friday snapshot close. Completed by operational accountant.`
    });

    setSuccess(true);
    setStep(4);
  };

  const currentFriday = new Date();
  const rawDay = currentFriday.getDay();
  const daysToFriday = (5 - rawDay + 7) % 7;
  currentFriday.setDate(currentFriday.getDate() + daysToFriday);
  const formattedFriday = currentFriday.toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" size={20} />
          Weekly Friday Closing Engine
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Lock portfolio metrics, apply operational charges, and take a permanent, unalterable snapshot of the funds ledger
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Step Wizard */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm md:col-span-2 space-y-6">
          {/* Timeline indicator */}
          <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
              Closing Wizard — Step {step} of 3
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-2 w-2 rounded-full transition-all ${
                    s === step ? 'bg-emerald-500 w-4' : s < step ? 'bg-emerald-900' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: REVIEW PORTFOLIOS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">1. Reconcile Active Portfolios</h3>
                <p className="text-xs text-zinc-500">Verify current capital balances and net profits before ledger lock.</p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {portfolios.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-zinc-200 block">{p.name}</span>
                      <span className="text-[10px] text-zinc-600 uppercase">{p.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">{formatNaira(p.currentCapital)}</span>
                      <span className={`text-[10px] font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.pnl >= 0 ? '+' : '-'}
                        {formatNaira(Math.abs(p.pnl))} PnL
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  <span>Verify and Proceed</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: APPLY FEES */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">2. Operations Cost Allocation</h3>
                <p className="text-xs text-zinc-500">Apply weekly operational charges, subscriptions, and manager fees to the pool.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Weekly Management Fee (₦)
                  </label>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Office Operations & Gas (₦)
                  </label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  <span>Set Allocation Costs</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM SNAPSHOT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">3. Generate & Lock Permanent Snapshot</h3>
                <p className="text-xs text-zinc-500">Confirm the unalterable snapshot details to write to the ledger history.</p>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-3 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Week Ending Date (Friday):</span>
                  <span className="font-bold text-white">{formattedFriday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deducted Operating Fees:</span>
                  <span className="font-bold text-red-400">-{formatNaira(parseFloat(fees))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deducted Operational Expenses:</span>
                  <span className="font-bold text-red-400">-{formatNaira(parseFloat(expenses))}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Operational Closing Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verify that all broker accounts matched MT4/5 terminals precisely before lock..."
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full h-16 resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCloseConfirm}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/30 cursor-pointer"
                >
                  <span>Lock Friday Snapshot</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS PAGE */}
          {success && step === 4 && (
            <div className="text-center py-12 space-y-4">
              <div className="h-14 w-14 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Friday Closing Successful</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Historical snapshot saved and ledger records verified. Previous week balance curves are permanently locked.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setSuccess(false);
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-300 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Historic Snapshot Log */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-300 uppercase tracking-wider mb-1">
                Locked Snapshot Archives
              </h3>
              <p className="text-xs text-zinc-500">Historical snapshots taken on previous Fridays</p>
            </div>

            <div className="space-y-3.5">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 font-mono text-xs text-zinc-400 space-y-1"
                >
                  <div className="flex justify-between border-b border-zinc-850 pb-1.5 mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1">
                      <CalendarDays size={12} className="text-emerald-500" />
                      Week: {snap.weekEnding}
                    </span>
                    <span className="text-[10px] text-zinc-600">{snap.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Liquidity:</span>
                    <span className="font-bold text-zinc-300">{formatNaira(snap.cashPosition)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AUM Locked:</span>
                    <span className="font-bold text-zinc-300">{formatNaira(snap.totalInvestorBalances)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans italic mt-1 leading-normal">
                    "{snap.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
