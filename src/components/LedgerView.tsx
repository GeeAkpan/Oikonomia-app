import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  FileText,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  X,
  BookOpen
} from 'lucide-react';
import { Transaction, Investor, Portfolio } from '../types';

interface LedgerViewProps {
  transactions: Transaction[];
  investors: Investor[];
  portfolios: Portfolio[];
  onPostTransaction: (txData: any) => void;
  role: string;
}

export default function LedgerView({
  transactions,
  investors,
  portfolios,
  onPostTransaction,
  role
}: LedgerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedContext, setSelectedContext] = useState<string>('All'); // All, Personal, Pool
  const [showPostForm, setShowPostForm] = useState(false);

  // Form State
  const [formType, setFormType] = useState<'Deposit' | 'Withdrawal' | 'Transfer' | 'Profit' | 'Loss' | 'Expense' | 'Adjustment'>('Deposit');
  const [formAmount, setFormAmount] = useState('');
  const [formPersonal, setFormPersonal] = useState(false);
  const [formCategory, setFormCategory] = useState('Operations');
  const [formInvestorId, setFormInvestorId] = useState('');
  const [formPortfolioId, setFormPortfolioId] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || parseFloat(formAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    onPostTransaction({
      type: formType,
      amount: parseFloat(formAmount),
      personal: formPersonal,
      category: formCategory,
      investorId: formInvestorId || undefined,
      portfolioId: formPortfolioId || undefined,
      description: formDescription
    });

    // Reset Form
    setFormAmount('');
    setFormDescription('');
    setFormInvestorId('');
    setFormPortfolioId('');
    setShowPostForm(false);
  };

  // Export ledger to CSV (fully client-side!)
  const exportToCsv = () => {
    const headers = ['ID', 'Timestamp', 'Type', 'Amount (NGN)', 'Context', 'Category', 'Description', 'Reference'];
    const rows = transactions.map((tx) => [
      tx.id,
      tx.timestamp,
      tx.type,
      tx.amount,
      tx.personal ? 'Personal' : 'Investor Pool',
      tx.category || 'N/A',
      tx.description,
      tx.reference
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Xena_Immutable_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || tx.type === selectedType;

    const matchesContext =
      selectedContext === 'All' ||
      (selectedContext === 'Personal' && tx.personal) ||
      (selectedContext === 'Pool' && !tx.personal);

    return matchesSearch && matchesType && matchesContext;
  });

  const categories = formPersonal
    ? ['Consulting', 'Salary', 'Book Sales', 'Freelance', 'Commissions', 'Food', 'Fuel', 'Internet', 'Software', 'Subscriptions', 'Office', 'Utilities', 'Travel']
    : ['Operations', 'Management Fee', 'Capital Call', 'Reinvestment', 'Profit Split', 'Loss Reconciled'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Immutable Ledger Engine</h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Audit log of all capital movements. Balances are derived dynamically.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          {['Owner', 'Admin', 'Accountant'].includes(role) && (
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/20 text-xs font-bold text-white rounded-xl transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Post Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-850 md:col-span-2">
          <Search size={14} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search by description, category, or Tx hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none w-full"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 px-3 py-2 focus:outline-none w-full"
          >
            <option value="All">All Transactions</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Transfer">Transfer</option>
            <option value="Borrow">Borrow</option>
            <option value="Repayment">Repayment</option>
            <option value="Profit">Profit</option>
            <option value="Loss">Loss</option>
            <option value="Expense">Expense</option>
            <option value="Adjustment">Adjustment</option>
          </select>
        </div>

        {/* Filter Context */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Context:</span>
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-zinc-200 px-3 py-2 focus:outline-none w-full"
          >
            <option value="All">All Capital</option>
            <option value="Pool">Investor Pool</option>
            <option value="Personal">Personal Finance</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-2">Date & Reference</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Context</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen size={28} className="text-zinc-700 mb-1" />
                      <span className="font-bold text-xs text-zinc-400">Ledger Empty</span>
                      <span className="text-[11px] text-zinc-600 max-w-sm font-sans leading-relaxed">
                        No financial records matched your current filters. Click "Post Transaction" on the top right to record your first dynamic entry manually!
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice().reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex flex-col">
                        <span className="text-zinc-400 text-[11px]">
                          {new Date(tx.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-bold">{tx.reference}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          tx.type === 'Deposit' || tx.type === 'Profit'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.type === 'Loss' || tx.type === 'Expense'
                            ? 'bg-red-500/10 text-red-400'
                            : tx.type === 'Borrow'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={tx.personal ? 'text-blue-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {tx.personal ? 'Personal' : 'Pool'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-zinc-500">{tx.category || 'N/A'}</td>
                    <td className="py-3 px-2 text-zinc-300 max-w-xs truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td
                      className={`py-3 px-2 text-right font-bold text-sm ${
                        tx.type === 'Deposit' || tx.type === 'Profit' || (tx.type === 'Repayment' && tx.personal === false)
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {tx.type === 'Deposit' || tx.type === 'Profit' || (tx.type === 'Repayment' && tx.personal === false) ? '+' : '-'}
                      {formatNaira(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post transaction modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <BookOpen size={18} className="text-emerald-500" />
                  Post Manual Entry
                </h3>
                <p className="text-xs text-zinc-500">Every entry creates a traceable record. Balances update instantly.</p>
              </div>
              <button
                onClick={() => setShowPostForm(false)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Context Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Fund Pool Context</label>
                  <select
                    value={formPersonal ? 'personal' : 'pool'}
                    onChange={(e) => setFormPersonal(e.target.value === 'personal')}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-sans"
                  >
                    <option value="pool">👥 Investor Pool Capital</option>
                    <option value="personal">👤 Separate Personal Finance</option>
                  </select>
                </div>

                {/* Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Transaction Type</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Deposit">Deposit (Inflow)</option>
                    <option value="Withdrawal">Withdrawal (Outflow)</option>
                    <option value="Transfer">Transfer / Allocate</option>
                    <option value="Profit">Profit payout</option>
                    <option value="Loss">Loss reconcile</option>
                    <option value="Expense">Expense</option>
                    <option value="Adjustment">Adjustment</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Amount (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic associations if Pool context */}
              {!formPersonal && (
                <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4">
                  {/* Link Investor */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Link Investor (Optional)</label>
                    <select
                      value={formInvestorId}
                      onChange={(e) => setFormInvestorId(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                    >
                      <option value="">-- No Association --</option>
                      {investors.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Link Portfolio */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Link Portfolio (Optional)</label>
                    <select
                      value={formPortfolioId}
                      onChange={(e) => setFormPortfolioId(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                    >
                      <option value="">-- No Association --</option>
                      {portfolios.map((port) => (
                        <option key={port.id} value={port.id}>
                          {port.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Audit Trail Description</label>
                <textarea
                  required
                  placeholder="Describe the nature of this inflow, outflow, transfer, or yield generation..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3.5 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-colors cursor-pointer"
                >
                  Confirm Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
