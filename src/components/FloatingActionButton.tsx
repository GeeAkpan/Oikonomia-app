import React, { useState } from 'react';
import {
  Plus,
  X,
  UserPlus,
  DollarSign,
  Coins,
  ShieldAlert,
  AlertCircle,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Investor, Portfolio } from '../types';

interface FloatingActionButtonProps {
  role: string;
  investors: Investor[];
  portfolios: Portfolio[];
  onAddInvestor: (investorData: any) => void;
  onPostTransaction: (txData: any) => void;
  onPostBorrowing: (borrowData: any) => void;
}

export default function FloatingActionButton({
  role,
  investors,
  portfolios,
  onAddInvestor,
  onPostTransaction,
  onPostBorrowing
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'investor' | 'transaction' | 'borrowing' | null>(null);

  // --- OBOARD INVESTOR STATE ---
  const [invName, setInvName] = useState('');
  const [invEmail, setInvEmail] = useState('');
  const [invPhone, setInvPhone] = useState('');
  const [invRisk, setInvRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [invRoi, setInvRoi] = useState('25');
  const [invDuration, setInvDuration] = useState('12');
  const [invDeposit, setInvDeposit] = useState('1000000');
  const [invNotes, setInvNotes] = useState('');
  const [invKyc, setInvKyc] = useState<'Pending' | 'Verified'>('Pending');
  const [invAllocations, setInvAllocations] = useState<{ [portId: string]: number }>({
    forex: 50,
    futures: 50,
    books: 0,
    memecoins: 0,
    spot: 0,
    real_estate: 0,
    stocks: 0
  });

  // --- ADD TRANSACTION STATE ---
  const [txType, setTxType] = useState<'Deposit' | 'Withdrawal' | 'Transfer' | 'Profit' | 'Loss' | 'Expense' | 'Adjustment'>('Deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txPersonal, setTxPersonal] = useState(false);
  const [txCategory, setTxCategory] = useState('Operations');
  const [txInvestorId, setTxInvestorId] = useState('');
  const [txPortfolioId, setTxPortfolioId] = useState('');
  const [txDescription, setTxDescription] = useState('');

  // --- INITIATE BORROWING STATE ---
  const [borSource, setBorSource] = useState<'Personal' | 'Business' | 'Investor Pool'>('Investor Pool');
  const [borDest, setBorDest] = useState<'Personal' | 'Business' | 'Investor Pool'>('Business');
  const [borAmount, setBorAmount] = useState('');
  const [borPurpose, setBorPurpose] = useState('');
  const [borDate, setBorDate] = useState('');
  const [borNotes, setBorNotes] = useState('');

  // Helper currency formatters
  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Role permissions checks
  const canOnboard = ['Owner', 'Admin', 'InvestmentManager'].includes(role);
  const canTransact = ['Owner', 'Admin', 'Accountant'].includes(role);
  const canBorrow = ['Owner', 'Admin', 'Accountant'].includes(role);

  // Onboard Investor Submit
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName || !invEmail) {
      alert('Name and Email are required.');
      return;
    }
    const totalAlloc = Object.values(invAllocations).reduce((sum, val) => sum + val, 0);
    if (totalAlloc !== 100 && parseFloat(invDeposit) > 0) {
      alert(`Asset allocations must total exactly 100%. Current is ${totalAlloc}%`);
      return;
    }

    onAddInvestor({
      name: invName,
      email: invEmail,
      phone: invPhone,
      riskProfile: invRisk,
      targetRoi: parseFloat(invRoi),
      duration: parseInt(invDuration),
      initialDeposit: parseFloat(invDeposit),
      notes: invNotes,
      kycStatus: invKyc,
      allocation: invAllocations,
      status: 'Active'
    });

    // Reset Form & Close
    setInvName('');
    setInvEmail('');
    setInvPhone('');
    setInvNotes('');
    setInvDeposit('1000000');
    setInvAllocations({
      forex: 50,
      futures: 50,
      books: 0,
      memecoins: 0,
      spot: 0,
      real_estate: 0,
      stocks: 0
    });
    setActiveModal(null);
    setIsOpen(false);
  };

  // Add Transaction Submit
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || parseFloat(txAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    onPostTransaction({
      type: txType,
      amount: parseFloat(txAmount),
      personal: txPersonal,
      category: txCategory,
      investorId: txInvestorId || undefined,
      portfolioId: txPortfolioId || undefined,
      description: txDescription
    });

    // Reset Form & Close
    setTxAmount('');
    setTxDescription('');
    setTxInvestorId('');
    setTxPortfolioId('');
    setActiveModal(null);
    setIsOpen(false);
  };

  // Initiate Borrowing Submit
  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borAmount || parseFloat(borAmount) <= 0) {
      alert('Please enter a valid borrowing amount.');
      return;
    }
    if (borSource === borDest) {
      alert('Source and Destination cannot be the same entity.');
      return;
    }

    onPostBorrowing({
      source: borSource,
      destination: borDest,
      amount: parseFloat(borAmount),
      purpose: borPurpose,
      expectedReturnDate: borDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: borNotes
    });

    // Reset Form & Close
    setBorAmount('');
    setBorPurpose('');
    setBorNotes('');
    setBorDate('');
    setActiveModal(null);
    setIsOpen(false);
  };

  const totalAllocation = Object.values(invAllocations).reduce((sum, val) => sum + val, 0);

  return (
    <>
      {/* Backdrop overlay for menu */}
      {isOpen && (
        <div
          id="fab-backdrop"
          className="fixed inset-0 bg-[#060709]/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Menu List */}
      <div className="fixed bottom-[9.5rem] lg:bottom-24 right-4 lg:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {isOpen && (
          <>
            {/* Quick action: Onboard Investor */}
            <div className="flex items-center gap-3 animate-fade-in pointer-events-auto">
              <span className="bg-[#16171a] border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#e0e2e5] shadow-lg font-mono">
                Onboard Investor
              </span>
              <button
                id="fab-onboard"
                onClick={() => {
                  if (!canOnboard) {
                    alert(`Unauthorized: Current role [${role}] is not allowed to onboard investors.`);
                    return;
                  }
                  setActiveModal('investor');
                }}
                disabled={!canOnboard}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 cursor-pointer ${
                  canOnboard
                    ? 'bg-zinc-900 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400'
                    : 'bg-zinc-950 border border-white/5 text-white/20 cursor-not-allowed opacity-55'
                }`}
              >
                <UserPlus size={18} />
              </button>
            </div>

            {/* Quick action: Add Transaction */}
            <div className="flex items-center gap-3 animate-fade-in pointer-events-auto">
              <span className="bg-[#16171a] border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#e0e2e5] shadow-lg font-mono">
                Add Transaction
              </span>
              <button
                id="fab-transaction"
                onClick={() => {
                  if (!canTransact) {
                    alert(`Unauthorized: Current role [${role}] is not allowed to write to ledger.`);
                    return;
                  }
                  setActiveModal('transaction');
                }}
                disabled={!canTransact}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 cursor-pointer ${
                  canTransact
                    ? 'bg-zinc-900 border border-blue-500/30 hover:border-blue-500 text-blue-400'
                    : 'bg-zinc-950 border border-white/5 text-white/20 cursor-not-allowed opacity-55'
                }`}
              >
                <DollarSign size={18} />
              </button>
            </div>

            {/* Quick action: Initiate Borrowing */}
            <div className="flex items-center gap-3 animate-fade-in pointer-events-auto">
              <span className="bg-[#16171a] border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#e0e2e5] shadow-lg font-mono">
                Initiate Borrowing
              </span>
              <button
                id="fab-borrow"
                onClick={() => {
                  if (!canBorrow) {
                    alert(`Unauthorized: Current role [${role}] is not allowed to initiate borrowings.`);
                    return;
                  }
                  setActiveModal('borrowing');
                }}
                disabled={!canBorrow}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 cursor-pointer ${
                  canBorrow
                    ? 'bg-zinc-900 border border-purple-500/30 hover:border-purple-500 text-purple-400'
                    : 'bg-zinc-950 border border-white/5 text-white/20 cursor-not-allowed opacity-55'
                }`}
              >
                <Coins size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Trigger FAB Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50">
        <button
          id="fab-main-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full bg-[#F43F5E] hover:bg-[#e11d48] text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer hover:shadow-[#F43F5E]/20 hover:shadow-lg ${
            isOpen ? 'rotate-135 bg-zinc-800 border border-white/10 hover:bg-zinc-700' : ''
          }`}
          title="Quick Access Tools"
        >
          {isOpen ? <X size={24} /> : <Plus size={24} className="animate-pulse" />}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. ONBOARD INVESTOR MODAL */}
      {/* ========================================================= */}
      {activeModal === 'investor' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111214] border border-white/5 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">
                    Onboard New Investor
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Register profile, capital parameters, and automated allocation rules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOnboardSubmit} className="p-6 space-y-6 flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    placeholder="Adewale Tinubu"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={invEmail}
                    onChange={(e) => setInvEmail(e.target.value)}
                    placeholder="tinubu@domain.ng"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={invPhone}
                    onChange={(e) => setInvPhone(e.target.value)}
                    placeholder="+234 803 111 2222"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Risk Profile */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Risk Profile</label>
                  <select
                    value={invRisk}
                    onChange={(e) => setInvRisk(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="Low">Low Drawdown / Conservative</option>
                    <option value="Medium">Medium Balanced growth</option>
                    <option value="High">High-Yield Automated Algo</option>
                  </select>
                </div>

                {/* Target ROI */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Target ROI (%)</label>
                  <input
                    type="number"
                    value={invRoi}
                    onChange={(e) => setInvRoi(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Contract Duration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Lock Term (Months)</label>
                  <select
                    value={invDuration}
                    onChange={(e) => setInvDuration(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="1">1 Month Bridge</option>
                    <option value="3">3 Months Quarterly</option>
                    <option value="6">6 Months Balanced</option>
                    <option value="12">12 Months Premium Lock</option>
                    <option value="24">24 Months Multi-year</option>
                  </select>
                </div>

                {/* Initial Capital Deposit */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase flex justify-between">
                    <span>Initial Deposit</span>
                    <span className="text-emerald-400 font-bold">{formatNaira(parseFloat(invDeposit) || 0)}</span>
                  </label>
                  <input
                    type="number"
                    value={invDeposit}
                    onChange={(e) => setInvDeposit(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>

                {/* KYC Verification Status */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">KYC / Compliance</label>
                  <select
                    value={invKyc}
                    onChange={(e) => setInvKyc(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="Pending">Pending Audit</option>
                    <option value="Verified">Verified Approved</option>
                  </select>
                </div>
              </div>

              {/* Allocation Weights (Only active if initial deposit > 0) */}
              {parseFloat(invDeposit) > 0 && (
                <div className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                        <Percent size={14} className="text-emerald-400" />
                        PORTFOLIO ALLOCATION RULE SET
                      </h4>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">
                        Define automated split weighting across active strategies
                      </p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                      totalAllocation === 100 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {totalAllocation}% Allocation
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {portfolios.map((port) => (
                      <div key={port.id} className="space-y-1 bg-zinc-950 p-2.5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold text-white/60 block truncate">{port.name}</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={invAllocations[port.id] ?? 0}
                            onChange={(e) => {
                              const num = parseInt(e.target.value) || 0;
                              setInvAllocations({
                                ...invAllocations,
                                [port.id]: num
                              });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 px-2 py-1 rounded text-xs text-white text-center font-mono"
                          />
                          <span className="text-[10px] text-white/40 font-mono">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Investor Memo / Notes</label>
                <textarea
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  placeholder="Details regarding reporting expectations, physical asset collaterals..."
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors h-16 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold text-white/60 hover:text-white rounded-xl transition-all cursor-pointer border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/20"
                >
                  <UserPlus size={14} />
                  <span>Onboard & Mint Deposit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ADD TRANSACTION MODAL */}
      {/* ========================================================= */}
      {activeModal === 'transaction' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111214] border border-white/5 rounded-3xl w-full max-w-xl shadow-2xl animate-fade-in flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <DollarSign size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">
                    Post Transaction Entry
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Append cryptographically labeled financial record to public ledgers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Context Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Financial Context</label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setTxPersonal(false);
                        setTxInvestorId('');
                      }}
                      className={`py-1.5 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        !txPersonal ? 'bg-zinc-900 text-white shadow' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Investor Pool
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTxPersonal(true);
                        setTxInvestorId('');
                      }}
                      className={`py-1.5 text-center text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        txPersonal ? 'bg-zinc-900 text-white shadow' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Personal Finance
                    </button>
                  </div>
                </div>

                {/* Ledger Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="Deposit">Deposit</option>
                    <option value="Withdrawal">Withdrawal</option>
                    <option value="Transfer">Transfer Position</option>
                    <option value="Profit">Profit Yield</option>
                    <option value="Loss">Loss Write-off</option>
                    <option value="Expense">Business Expense</option>
                    <option value="Adjustment">Balance Adjustment</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase flex justify-between">
                    <span>Transaction Value</span>
                    <span className="text-blue-400 font-bold">{formatNaira(parseFloat(txAmount) || 0)}</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="1500000"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                </div>

                {/* Category Picker */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Classification Group</label>
                  <input
                    type="text"
                    required
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    placeholder="Capital Deployment, Software, Legal Fee..."
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Dynamic Conditional Dropdowns */}
                {!txPersonal && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Related Investor (Optional)</label>
                    <select
                      value={txInvestorId}
                      onChange={(e) => setTxInvestorId(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="">-- No specific investor --</option>
                      {investors.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Target Strategy Portfolio</label>
                  <select
                    value={txPortfolioId}
                    onChange={(e) => setTxPortfolioId(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="">-- Main Treasury / Cash --</option>
                    {portfolios.map((port) => (
                      <option key={port.id} value={port.id}>
                        {port.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Memo / Ledger Narration</label>
                <textarea
                  required
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="Automated Forex scalper week ending profit return..."
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors h-16 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold text-white/60 hover:text-white rounded-xl transition-all cursor-pointer border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-950/20"
                >
                  <DollarSign size={14} />
                  <span>Commit Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. INITIATE BORROWING MODAL */}
      {/* ========================================================= */}
      {activeModal === 'borrowing' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111214] border border-white/5 rounded-3xl w-full max-w-xl shadow-2xl animate-fade-in flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Coins size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">
                    Initiate Pool Borrowing Shift
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">
                    Authorize interest-free internal credit lines between Personal and Business assets
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBorrowSubmit} className="p-6 space-y-6">
              {/* Warnings and Disclaimers */}
              <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-purple-400 mt-0.5 flex-shrink-0 animate-bounce" />
                <p className="text-[10px] text-purple-200/70 font-mono leading-relaxed">
                  <span className="font-bold text-purple-300">COMPLIANCE RULE:</span> All shifts from the investor pool
                  to personal accounts must have documented refund horizons. This action will auto-create maturity
                  reminders on the system calendar.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Source Entity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Creditor Source</label>
                  <select
                    value={borSource}
                    onChange={(e) => setBorSource(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="Investor Pool">Investor Pool (Lenders)</option>
                    <option value="Personal">Personal (Owner savings)</option>
                    <option value="Business">Business (Treasury Cash)</option>
                  </select>
                </div>

                {/* Destination Entity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Debtor Destination</label>
                  <select
                    value={borDest}
                    onChange={(e) => setBorDest(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="Business">Business (Treasury Cash)</option>
                    <option value="Personal">Personal (Owner savings)</option>
                    <option value="Investor Pool">Investor Pool (Lenders)</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase flex justify-between">
                    <span>Borrow Amount</span>
                    <span className="text-purple-400 font-bold">{formatNaira(parseFloat(borAmount) || 0)}</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={borAmount}
                    onChange={(e) => setBorAmount(e.target.value)}
                    placeholder="500000"
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  />
                </div>

                {/* Return Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Expected Repayment Date</label>
                  <input
                    type="date"
                    required
                    value={borDate}
                    onChange={(e) => setBorDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Purpose / Borrowing Intent</label>
                <input
                  type="text"
                  required
                  value={borPurpose}
                  onChange={(e) => setBorPurpose(e.target.value)}
                  placeholder="Lekki flip land registry title search fees bridge..."
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-white/40 uppercase">Additional Collateral / Details</label>
                <textarea
                  value={borNotes}
                  onChange={(e) => setBorNotes(e.target.value)}
                  placeholder="Will repay in full from Gumroad book dividends next Friday close..."
                  className="w-full bg-zinc-950 border border-white/5 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors h-16 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold text-white/60 hover:text-white rounded-xl transition-all cursor-pointer border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-950/20"
                >
                  <Coins size={14} />
                  <span>Approve & Initiate Shift</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
