import React, { useState, useEffect } from 'react';
import { Bell, Search, ShieldAlert, CalendarClock, Check, UserCircle2, Database, Trash2, RefreshCw, AlertTriangle, Menu } from 'lucide-react';
import { UserRole, Notification } from '../types';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  onResetState: (mode: 'clean' | 'demo') => void;
  currentMode: 'clean' | 'demo';
  onToggleMobileMenu?: () => void;
}

export default function Header({
  role,
  setRole,
  notifications,
  markAsRead,
  clearNotifications,
  onResetState,
  currentMode,
  onToggleMobileMenu
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDbManager, setShowDbManager] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: UserRole[] = ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer', 'Investor'];

  return (
    <header className="bg-[#16171a]/85 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-40">
      {/* Title / Clock */}
      <div className="flex items-center gap-2.5 w-full md:w-auto">
        {/* Mobile Hamburger menu */}
        <button
          onClick={onToggleMobileMenu}
          className="block lg:hidden p-2 bg-[#0a0b0d] hover:bg-white/5 text-white/80 hover:text-white rounded-xl border border-white/5 cursor-pointer transition-colors flex-shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={16} />
        </button>

        <div className="flex items-center gap-2.5 bg-[#0a0b0d] px-4 py-2 rounded-xl border border-white/5 text-white/90 text-xs font-mono font-bold tracking-wide shadow-sm flex-grow sm:flex-grow-0 justify-center sm:justify-start">
          <CalendarClock size={14} className="text-emerald-400 flex-shrink-0" />
          <span className="truncate">
            {time.toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      </div>

      {/* Controls: Role switcher, Database Manager, Notifications, Profile */}
      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t border-white/5 pt-2 md:pt-0 md:border-0">
        
        {/* Database Manager Button & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDbManager(!showDbManager);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0b0d] hover:bg-white/5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
              currentMode === 'clean'
                ? 'border-red-500/20 text-red-400'
                : 'border-emerald-500/20 text-emerald-400'
            }`}
          >
            <Database size={13} className={currentMode === 'clean' ? 'text-red-400' : 'text-emerald-400'} />
            <span className="hidden xs:inline">
              {currentMode === 'clean' ? 'Clean Slate' : 'Demo Data'}
            </span>
          </button>

          {showDbManager && (
            <div className="absolute right-0 mt-3 w-80 bg-[#16171a] rounded-2xl border border-white/10 shadow-2xl p-4 z-50">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
                <Database size={15} className={currentMode === 'clean' ? 'text-red-400' : 'text-emerald-400'} />
                <span className="font-bold text-xs text-white font-sans">System Database Manager</span>
              </div>

              <p className="text-[11px] text-white/50 mb-4 leading-relaxed font-sans">
                Choose between starting completely fresh to input your own records or loading the pre-configured demo set.
              </p>

              <div className="space-y-2.5">
                {/* Option 1: Clean Slate */}
                <button
                  onClick={() => {
                    onResetState('clean');
                    setShowDbManager(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    currentMode === 'clean'
                      ? 'bg-red-500/10 border-red-500/20 text-red-200 shadow-inner'
                      : 'bg-[#0a0b0d] border border-white/5 hover:border-red-500/20 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg mt-0.5">
                    <Trash2 size={13} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block font-sans">Start with Clean Slate</span>
                    <span className="text-[10px] text-white/40 block mt-0.5 leading-normal font-sans">
                      Wipe all database records so you can input your own real investors, transactions, and holdings manually.
                    </span>
                  </div>
                </button>

                {/* Option 2: Demo Data */}
                <button
                  onClick={() => {
                    onResetState('demo');
                    setShowDbManager(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    currentMode === 'demo'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200 shadow-inner'
                      : 'bg-[#0a0b0d] border border-white/5 hover:border-emerald-500/20 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg mt-0.5">
                    <RefreshCw size={13} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block font-sans">Load Demo Data Set</span>
                    <span className="text-[10px] text-white/40 block mt-0.5 leading-normal font-sans">
                      Re-seed the ledger with sample portfolios, borrowings, snapshots, and activity logs for preview.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Selector with label */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#0a0b0d] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/5 flex-grow sm:flex-grow-0">
          <span className="hidden xs:inline text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">Impersonate:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-[#16171a] border border-white/5 text-[11px] sm:text-xs font-semibold rounded-lg text-white px-2 py-0.5 sm:py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
          >
            {rolesList.map((r) => (
              <option key={r} value={r}>
                {r === 'Owner' ? '👑 Owner' : r === 'Admin' ? '🛠️ Admin' : r === 'Accountant' ? '💼 Accountant' : r === 'InvestmentManager' ? '📊 Invest Mgr' : r === 'Viewer' ? '👁️ Viewer' : '👤 Investor'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 bg-[#0a0b0d] hover:bg-white/5 text-white/80 hover:text-white rounded-xl border border-white/5 transition-colors relative cursor-pointer"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full text-[9px] font-black flex items-center justify-center text-black border-2 border-[#16171a] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#16171a] rounded-2xl border border-white/5 shadow-2xl p-3 sm:p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                  <span className="font-bold text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider">System Log Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      Dismiss All
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-white/40">No active notifications</div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          n.read
                            ? 'bg-[#0a0b0d]/50 border-transparent text-white/40'
                            : 'bg-[#0a0b0d] border-white/5 text-white hover:border-emerald-500/40 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            {n.type === 'alert' || n.type === 'warning' ? (
                              <ShieldAlert size={12} className="text-orange-400" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                            {n.title}
                          </span>
                          {!n.read && <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />}
                        </div>
                        <p className="text-[11px] mt-1 leading-relaxed text-white/60">{n.message}</p>
                        <span className="text-[9px] font-mono text-white/20 mt-1 block">
                          {new Date(n.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Card */}
          <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-white/10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
              GA
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">Godswill OS</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40 leading-none">godswill@atlas.ng</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
