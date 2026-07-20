import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MotionDiv = motion.div;
import {
  Clock,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Copy,
  ChevronRight,
  TrendingUp,
  User,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Database
} from 'lucide-react';
import { Transaction, Investor } from '../types';

interface ActivityTimelineProps {
  transactions: Transaction[];
  investors: Investor[];
}

// Helper to determine the actor and style for a transaction
interface ActorInfo {
  name: string;
  role: 'Investor' | 'Owner' | 'System Bot';
  initials: string;
  gradient: string;
}

export default function ActivityTimeline({ transactions, investors }: ActivityTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'Investor' | 'Owner' | 'System Bot'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // System time anchor: 2026-07-20T14:11:18-07:00
  const SYSTEM_TIME = useMemo(() => new Date('2026-07-20T14:11:18-07:00'), []);

  // Format relative time helper
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const diffMs = SYSTEM_TIME.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    if (diffDays < 30) return `${diffWeeks} weeks ago`;
    
    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
  };

  // Maps a transaction to its main Actor information
  const getActorInfo = (tx: Transaction): ActorInfo => {
    if (tx.investorId) {
      const inv = investors.find((i) => i.id === tx.investorId);
      if (inv) {
        const parts = inv.name.split(' ');
        const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : inv.name.substring(0, 2);
        
        // Colors based on investor risk profiles or names
        let gradient = 'from-teal-500 to-emerald-500';
        if (inv.riskProfile === 'High') {
          gradient = 'from-amber-500 to-red-500';
        } else if (inv.riskProfile === 'Medium') {
          gradient = 'from-blue-500 to-indigo-500';
        }
        
        return {
          name: inv.name,
          role: 'Investor',
          initials: initials.toUpperCase(),
          gradient
        };
      }
    }

    if (tx.personal) {
      return {
        name: 'Olumide (Owner)',
        role: 'Owner',
        initials: 'OL',
        gradient: 'from-purple-500 to-pink-500'
      };
    }

    // Default: System automated processes/re-routing
    return {
      name: 'Xena Algo Bot',
      role: 'System Bot',
      initials: 'XB',
      gradient: 'from-cyan-500 to-blue-600'
    };
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Naira Formatter
  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Full derived timeline data
  const timelineData = useMemo(() => {
    return transactions
      .map((tx) => {
        const actor = getActorInfo(tx);
        const relativeTime = getRelativeTime(tx.timestamp);
        return {
          ...tx,
          actor,
          relativeTime
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, investors, SYSTEM_TIME]);

  // Filters
  const filteredTimeline = useMemo(() => {
    return timelineData.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'All' || item.actor.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [timelineData, searchTerm, filterRole]);

  return (
    <div className="bg-[#16171a] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col h-full">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Secured Activity Timeline
            </h3>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Real-time auditable pipeline of all transaction entries, allocations, and administrative shifts.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-[10px] text-white/40">
          <Database size={12} className="text-emerald-500" />
          <span>Sync Live: {filteredTimeline.length} Entries</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Search Input */}
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            type="text"
            placeholder="Search timeline by reference, actor, memo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0b0d] border border-white/5 pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1 bg-[#0a0b0d] border border-white/5 p-1 rounded-xl">
          {(['All', 'Investor', 'Owner', 'System Bot'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`flex-1 text-center py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterRole === role
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {role === 'System Bot' ? 'Bot' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List Scrollable Container */}
      <div className="flex-grow overflow-y-auto max-h-[420px] pr-2 custom-scrollbar">
        {filteredTimeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock size={32} className="text-white/10 mb-2.5 animate-pulse" />
            <span className="text-xs font-semibold text-white/40 font-mono">No matching audited events</span>
            <span className="text-[10px] text-white/20 mt-1">Try adjusting your filters or search query</span>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-white/5 space-y-6 ml-3">
            <AnimatePresence initial={false}>
              {filteredTimeline.map((item, index) => {
                const isPositive = ['Deposit', 'Profit'].includes(item.type);
                const isNegative = ['Loss', 'Expense', 'Withdrawal'].includes(item.type);

                return (
                  <MotionDiv
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                    className="relative group"
                  >
                    {/* Glowing dot on the timeline connector */}
                    <span className="absolute -left-[31px] top-4 h-2.5 w-2.5 rounded-full border border-zinc-950 bg-zinc-800 group-hover:scale-125 group-hover:bg-emerald-500 transition-all duration-300 z-10" />

                    {/* Timeline Card content */}
                    <div className="bg-[#0a0b0d] hover:bg-[#111214] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Left: Avatar + Actor Details */}
                        <div className="flex items-center gap-3">
                          {/* Beautiful gradient avatar with uppercase initials */}
                          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${item.actor.gradient} p-[1px] flex-shrink-0 shadow-lg relative group-hover:scale-105 transition-transform duration-300`}>
                            <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center text-white font-mono text-xs font-black tracking-tight">
                              {item.actor.initials}
                            </div>
                            {/* Visual glowing status dot for online transparency */}
                            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-sans tracking-tight">
                                {item.actor.name}
                              </span>
                              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                item.actor.role === 'System Bot'
                                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                  : item.actor.role === 'Owner'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {item.actor.role}
                              </span>
                            </div>
                            
                            <p className="text-xs text-white/70 mt-1 font-mono leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Amount & Badges */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 self-start sm:self-center">
                          <span className={`text-xs font-mono font-black ${
                            isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-zinc-400'
                          }`}>
                            {isPositive ? '+' : isNegative ? '-' : ''}
                            {formatNaira(item.amount)}
                          </span>

                          <span className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{item.relativeTime}</span>
                            <span>•</span>
                            <span className="text-white/20">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>
                      </div>

                      {/* Footer: Ledger labels + cryptograph audit references */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/40">
                        <div className="flex items-center gap-3">
                          <span className="bg-white/5 px-2 py-0.5 rounded-md text-white/60">
                            {item.category}
                          </span>
                          <span className="bg-white/5 px-2 py-0.5 rounded-md text-white/60 uppercase">
                            {item.type}
                          </span>
                        </div>

                        {/* Copyable cryptographic ledger handle */}
                        <button
                          type="button"
                          onClick={() => handleCopyRef(item.reference)}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-white/5 px-2 py-0.5 rounded-md hover:bg-white/10"
                        >
                          <span>REF:</span>
                          <span className="font-bold text-emerald-400/80">{item.reference}</span>
                          <Copy size={10} className={copiedId === item.reference ? 'text-emerald-400' : ''} />
                        </button>
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
