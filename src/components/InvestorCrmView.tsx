import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  X,
  Phone,
  Mail,
  PieChart,
  ShieldAlert,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Investor, Portfolio, Transaction } from '../types';

interface InvestorCrmViewProps {
  investors: Investor[];
  portfolios: Portfolio[];
  transactions: Transaction[];
  onAddInvestor: (investorData: any) => void;
  role: string;
}

export default function InvestorCrmView({ investors, portfolios, transactions, onAddInvestor, role }: InvestorCrmViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Investor Form State
  const [newInvName, setNewInvName] = useState('');
  const [newInvEmail, setNewInvEmail] = useState('');
  const [newInvPhone, setNewInvPhone] = useState('');
  const [newInvRisk, setNewInvRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newInvRoi, setNewInvRoi] = useState('25');
  const [newInvDuration, setNewInvDuration] = useState('12');
  const [newInvDeposit, setNewInvDeposit] = useState('1000000');
  const [newInvNotes, setNewInvNotes] = useState('');
  const [newInvKyc, setNewInvKyc] = useState<'Pending' | 'Verified'>('Pending');

  // Allocation splits across active portfolios (initially 50/50 Forex/Futures)
  const [allocations, setAllocations] = useState<{ [portId: string]: number }>({
    forex: 50,
    futures: 50,
    books: 0,
    memecoins: 0,
    spot: 0,
    real_estate: 0,
    stocks: 0
  });

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleAllocChange = (portId: string, val: string) => {
    const num = parseInt(val) || 0;
    setAllocations({
      ...allocations,
      [portId]: num
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName || !newInvEmail) {
      alert('Name and Email are required.');
      return;
    }
    if (totalAllocation !== 100 && parseFloat(newInvDeposit) > 0) {
      alert(`Asset allocations must total exactly 100%. Current is ${totalAllocation}%`);
      return;
    }

    onAddInvestor({
      name: newInvName,
      email: newInvEmail,
      phone: newInvPhone,
      riskProfile: newInvRisk,
      targetRoi: parseFloat(newInvRoi),
      duration: parseInt(newInvDuration),
      initialDeposit: parseFloat(newInvDeposit),
      notes: newInvNotes,
      kycStatus: newInvKyc,
      allocation: allocations,
      status: 'Active'
    });

    // Reset Form
    setNewInvName('');
    setNewInvEmail('');
    setNewInvPhone('');
    setNewInvNotes('');
    setNewInvDeposit('1000000');
    setAllocations({
      forex: 50,
      futures: 50,
      books: 0,
      memecoins: 0,
      spot: 0,
      real_estate: 0,
      stocks: 0
    });
    setShowAddForm(false);
  };

  const filteredInvestors = investors.filter(
    (inv) =>
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Investor CRM Registry</h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Track profiles, onboarding KYC status, expected returns, and active asset allocations</p>
        </div>
        {['Owner', 'Admin', 'InvestmentManager'].includes(role) && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/20 text-xs font-bold text-white rounded-xl transition-all cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Onboard New Investor</span>
          </button>
        )}
      </div>

      {/* Grid of list and detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Investor list */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
            <Search size={16} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Search by investor name, email, account status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-500 w-full focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-2">Investor Profile</th>
                  <th className="py-3 px-2">Risk Rating</th>
                  <th className="py-3 px-2">Expected ROI</th>
                  <th className="py-3 px-2">Verified KYC</th>
                  <th className="py-3 px-2">Maturity Status</th>
                  <th className="py-3 px-2">Current Balance</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredInvestors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users size={28} className="text-zinc-700 mb-1" />
                        <span className="font-bold text-xs text-zinc-400">No Onboarded Investors</span>
                        <span className="text-[11px] text-zinc-600 max-w-sm leading-relaxed">
                          Your investor database is currently empty. Onboard your first investor to deposit capital, configure targeted allocations, and deploy system positions.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvestors.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvestor(inv)}
                      className={`hover:bg-zinc-900/40 transition-colors cursor-pointer ${
                        selectedInvestor?.id === inv.id ? 'bg-emerald-950/20 border-l-2 border-emerald-500' : ''
                      }`}
                    >
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-200 text-sm">{inv.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{inv.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            inv.riskProfile === 'High'
                              ? 'bg-red-500/10 text-red-400'
                              : inv.riskProfile === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {inv.riskProfile}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-mono font-bold text-zinc-200">
                        {inv.targetRoi}% <span className="text-[9px] text-zinc-500">({inv.duration}mo)</span>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`flex items-center gap-1 font-mono text-[10px] ${
                            inv.kycStatus === 'Verified'
                              ? 'text-emerald-400 font-bold'
                              : inv.kycStatus === 'Pending'
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}
                        >
                          {inv.kycStatus === 'Verified' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {inv.kycStatus}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            inv.status === 'Active'
                              ? 'bg-emerald-950 text-emerald-400'
                              : inv.status === 'Pending'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 font-mono font-bold text-white text-sm">
                        {/* Calculate balance from local state if available */}
                        {formatNaira((inv as any).currentBalance || 0)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <ChevronRight size={16} className="text-zinc-600 ml-auto" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed Dashboard / Portfolio Breakdown */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          {selectedInvestor ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">{selectedInvestor.name}</h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">
                    Investor Profile Panel
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInvestor(null)}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Quick stats panel */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Current Balance:</span>
                  <span className="font-mono font-bold text-white text-lg">
                    {formatNaira((selectedInvestor as any).currentBalance || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Total Deployed:</span>
                  <span className="font-mono text-zinc-300">
                    {formatNaira((selectedInvestor as any).totalInvested || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Total Withdrawals:</span>
                  <span className="font-mono text-zinc-400">
                    {formatNaira((selectedInvestor as any).totalWithdrawn || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Accrued Yields:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +{formatNaira((selectedInvestor as any).totalProfitAllocated || 0)}
                  </span>
                </div>
              </div>

              {/* Active Portfolio Allocation Splits */}
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-3">
                  Capital Splits & Allocations
                </h4>
                <div className="space-y-3.5">
                  {Object.entries(selectedInvestor.allocation).map(([portId, percentage]) => {
                    const port = portfolios.find((p) => p.id === portId);
                    if (!port) return null;
                    return (
                      <div key={portId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-300 font-bold">{port.name}</span>
                          <span className="text-zinc-400">{percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Agreements */}
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  KYC & Active Agreements
                </h4>
                {selectedInvestor.agreements.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">No upload records found.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedInvestor.agreements.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center justify-between text-xs font-mono text-zinc-300"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileText size={14} className="text-zinc-500" />
                          <span className="truncate">{doc}</span>
                        </span>
                        <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes block */}
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Manager Internal Notes
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed italic">
                  "{selectedInvestor.notes || 'No notes on record.'}"
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-3">
              <Users size={32} className="text-zinc-700" />
              <span>Select an investor from the registry to view portfolio dashboard and split weights</span>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Dialog/Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans">Onboard Private Investor</h3>
                <p className="text-xs text-zinc-500">Register profile and generate allocation ledger records</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chidi Egwu"
                    value={newInvName}
                    onChange={(e) => setNewInvName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. chidi@example.ng"
                    value={newInvEmail}
                    onChange={(e) => setNewInvEmail(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Phone Line</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 000 0000"
                    value={newInvPhone}
                    onChange={(e) => setNewInvPhone(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Risk Rating</label>
                  <select
                    value={newInvRisk}
                    onChange={(e: any) => setNewInvRisk(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Low">Low Risk (Preservation)</option>
                    <option value="Medium">Medium Risk (Balanced)</option>
                    <option value="High">High Risk (Aggressive)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Expected ROI (%)</label>
                  <input
                    type="number"
                    value={newInvRoi}
                    onChange={(e) => setNewInvRoi(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Duration (Months)</label>
                  <input
                    type="number"
                    value={newInvDuration}
                    onChange={(e) => setNewInvDuration(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Initial Capital Deposit (₦)</label>
                  <input
                    type="number"
                    value={newInvDeposit}
                    onChange={(e) => setNewInvDeposit(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">KYC Onboarding status</label>
                  <select
                    value={newInvKyc}
                    onChange={(e: any) => setNewInvKyc(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Pending">Pending (Doc Collection)</option>
                    <option value="Verified">Verified (Active Contract)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Capital Allocation Slider Block */}
              <div className="border border-zinc-850 p-4 rounded-xl bg-zinc-900/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">
                    Capital Allocation Splits (Total: {totalAllocation}%)
                  </h4>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      totalAllocation === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {totalAllocation === 100 ? '✓ Ready (100%)' : `Requires exactly 100%`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portfolios.map((port) => (
                    <div key={port.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                      <span className="text-xs text-zinc-300 truncate">{port.name}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={allocations[port.id] || 0}
                          onChange={(e) => handleAllocChange(port.id, e.target.value)}
                          className="w-12 bg-zinc-900 border border-zinc-800 rounded text-center text-xs text-white py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-zinc-500 font-mono">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Manager Notes</label>
                <textarea
                  value={newInvNotes}
                  onChange={(e) => setNewInvNotes(e.target.value)}
                  placeholder="Notes about risk tolerances, communication frequencies..."
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3.5 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={totalAllocation !== 100 && parseFloat(newInvDeposit) > 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-colors cursor-pointer"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
