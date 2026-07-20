import React, { useState } from 'react';
import {
  ArrowDownUp,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  DollarSign,
  X,
  CreditCard,
  NotebookTabs
} from 'lucide-react';
import { Borrowing } from '../types';

interface BorrowingViewProps {
  borrowings: Borrowing[];
  role: string;
  onPostBorrowing: (borrowData: any) => void;
  onRepayBorrowing: (repayData: any) => void;
}

export default function BorrowingView({
  borrowings,
  role,
  onPostBorrowing,
  onRepayBorrowing
}: BorrowingViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBorrowForRepay, setSelectedBorrowForRepay] = useState<Borrowing | null>(null);

  // New Borrow Form State
  const [newBType, setNewBType] = useState<'Personal' | 'Business' | 'Investor Pool'>('Investor Pool');
  const [newBDest, setNewBDest] = useState<'Personal' | 'Business' | 'Investor Pool'>('Business');
  const [newBAmount, setNewBAmount] = useState('');
  const [newBPurpose, setNewBPurpose] = useState('');
  const [newBDate, setNewBDate] = useState('');
  const [newBNotes, setNewBNotes] = useState('');

  // Repayment State
  const [repayAmount, setRepayAmount] = useState('');
  const [repayNotes, setRepayNotes] = useState('');

  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleSubmitBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBAmount || parseFloat(newBAmount) <= 0) {
      alert('Please enter a valid borrowing amount.');
      return;
    }
    if (newBType === newBDest) {
      alert('Source and Destination cannot be the same entity.');
      return;
    }

    onPostBorrowing({
      source: newBType,
      destination: newBDest,
      amount: parseFloat(newBAmount),
      purpose: newBPurpose,
      expectedReturnDate: newBDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: newBNotes
    });

    // Reset Form
    setNewBAmount('');
    setNewBPurpose('');
    setNewBNotes('');
    setShowAddForm(false);
  };

  const handleSubmitRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrowForRepay) return;
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      alert('Please enter a valid repayment amount.');
      return;
    }

    onRepayBorrowing({
      borrowId: selectedBorrowForRepay.id,
      amount: parseFloat(repayAmount),
      notes: repayNotes
    });

    // Reset
    setRepayAmount('');
    setRepayNotes('');
    setSelectedBorrowForRepay(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Internal Liquidity Borrowing Registry</h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Cross-lend between personal cash, business accounts, and investor pool reserves with tracked timelines</p>
        </div>
        {['Owner', 'Admin', 'Accountant'].includes(role) && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/20 text-xs font-bold text-white rounded-xl transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Borrow Liquidity</span>
          </button>
        )}
      </div>

      {/* Grid List */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {borrowings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-zinc-500">
              <ArrowDownUp size={28} className="text-zinc-700 mb-2 animate-pulse" />
              <span className="font-bold text-xs text-zinc-400">No Active Inter-Entity Borrowings</span>
              <span className="text-[11px] text-zinc-600 max-w-sm font-sans mt-1 leading-relaxed">
                No leverage agreements are registered in the ledger. Inter-entity borrowings allow moving capital dynamically between the Investor Pool, Business Reserve, and Personal accounts.
              </span>
            </div>
          ) : (
            borrowings.map((b) => {
              const isLate = b.status === 'Late';
              const isCompleted = b.status === 'Completed';

              return (
                <div
                  key={b.id}
                  className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-300">{b.source}</span>
                      <ArrowRight size={14} className="text-zinc-600" />
                      <span className="font-bold text-emerald-400">{b.destination}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : isLate
                            ? 'bg-red-500/10 text-red-400 animate-pulse'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-400 text-[11px]">
                      <div>
                        <span className="text-zinc-600 uppercase block text-[9px]">Borrowing Purpose</span>
                        <span className="text-zinc-300 font-sans">{b.purpose}</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 uppercase block text-[9px]">Lent Date</span>
                        <span>{b.date}</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 uppercase block text-[9px]">Expected Return</span>
                        <span>{b.expectedReturnDate}</span>
                      </div>
                      <div>
                        <span className="text-zinc-600 uppercase block text-[9px]">Manager Note</span>
                        <span className="truncate block max-w-xs font-sans text-zinc-500 italic">"{b.notes}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between h-full gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-zinc-500 block text-[9px] uppercase">Principal Lent</span>
                      <span className="font-black text-white text-base">{formatNaira(b.amount)}</span>
                    </div>

                    {!isCompleted && ['Owner', 'Admin', 'Accountant'].includes(role) && (
                      <button
                        onClick={() => setSelectedBorrowForRepay(b)}
                        className="px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 font-bold hover:bg-emerald-950/80 rounded-lg text-[11px] transition-colors cursor-pointer"
                      >
                        Record Repayment
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Borrow Liquidity Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <ArrowDownUp size={18} className="text-emerald-500" />
                  Initiate Internal Borrowing
                </h3>
                <p className="text-xs text-zinc-500">Temporarily bridge capital reserves. Standard repayment parameters apply.</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBorrow} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Source */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Lending Source</label>
                  <select
                    value={newBType}
                    onChange={(e: any) => setNewBType(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Investor Pool">👥 Investor Pool reserves</option>
                    <option value="Personal">👤 Personal funds</option>
                    <option value="Business">💼 Corporate/Business</option>
                  </select>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Destination Account</label>
                  <select
                    value={newBDest}
                    onChange={(e: any) => setNewBDest(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                  >
                    <option value="Business">💼 Corporate/Business</option>
                    <option value="Personal">👤 Personal account</option>
                    <option value="Investor Pool">👥 Investor Pool reserves</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Capital Amount (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 250000"
                    value={newBAmount}
                    onChange={(e) => setNewBAmount(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>

                {/* Return Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Expected Return Date</label>
                  <input
                    type="date"
                    required
                    value={newBDate}
                    onChange={(e) => setNewBDate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Borrow Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real Estate deposit cash flip"
                  value={newBPurpose}
                  onChange={(e) => setNewBPurpose(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Operational Notes</label>
                <textarea
                  value={newBNotes}
                  onChange={(e) => setNewBNotes(e.target.value)}
                  placeholder="Repayment logic details, backup liquidity sources..."
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-colors cursor-pointer"
                >
                  Approve Borrowing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repayment Modal */}
      {selectedBorrowForRepay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <CreditCard size={18} className="text-emerald-500" />
                  Record Borrow Repayment
                </h3>
                <p className="text-xs text-zinc-500">Record partial or full return of lent capital</p>
              </div>
              <button
                onClick={() => setSelectedBorrowForRepay(null)}
                className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRepay} className="space-y-4">
              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-850 font-mono text-xs space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Borrow Code:</span>
                  <span className="font-bold text-white">{selectedBorrowForRepay.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Principal borrowed:</span>
                  <span className="font-bold text-white">{formatNaira(selectedBorrowForRepay.amount)}</span>
                </div>
              </div>

              {/* Repay Amount */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Repayment Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 150000"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full font-mono"
                />
              </div>

              {/* Repay Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Repayment Note</label>
                <textarea
                  value={repayNotes}
                  onChange={(e) => setRepayNotes(e.target.value)}
                  placeholder="Specify payment details (e.g. Bank transfer reference ID)..."
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3.5 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBorrowForRepay(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-colors cursor-pointer"
                >
                  Submit Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
