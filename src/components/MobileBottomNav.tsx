import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  PieChart,
  ArrowDownUp,
  Calendar,
  ShieldCheck,
  Bot,
  Layers,
  Menu,
  X,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onResetState?: (mode: 'clean' | 'demo') => void;
  currentMode?: 'clean' | 'demo';
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  role,
  onResetState,
  currentMode
}: MobileBottomNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // All menu items configured with role-based visibility
  const allItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer', 'Investor'] },
    { id: 'investors', name: 'Investor CRM', icon: Users, roles: ['Owner', 'Admin', 'InvestmentManager', 'Viewer'] },
    { id: 'ledger', name: 'Fund Ledger', icon: FileSpreadsheet, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] },
    { id: 'portfolio', name: 'Portfolio Engine', icon: PieChart, roles: ['Owner', 'Admin', 'InvestmentManager', 'Viewer'] },
    { id: 'borrowing', name: 'Internal Borrowing', icon: ArrowDownUp, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] },
    { id: 'weekly-close', name: 'Weekly Closing', icon: ShieldCheck, roles: ['Owner', 'Admin', 'Accountant'] },
    { id: 'ai-analyst', name: 'AI Analyst', icon: Bot, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer', 'Investor'] },
    { id: 'tasks-calendar', name: 'Tasks', icon: Calendar, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer'] },
    { id: 'reports', name: 'Reports', icon: Layers, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] }
  ];

  // Filter items visible for the user's role
  const visibleItems = allItems.filter(item => item.roles.includes(role));

  // Determine dynamic Tab 3 & Tab 4 based on user role to keep key actions right under the thumb
  const getPrimaryTabs = () => {
    const tabs = [
      { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
      { id: 'ai-analyst', name: 'AI Assistant', icon: Bot }
    ];

    // Pick 3rd primary tab
    if (role === 'Accountant') {
      tabs.push({ id: 'ledger', name: 'Ledger', icon: FileSpreadsheet });
    } else if (['Owner', 'Admin', 'InvestmentManager'].includes(role)) {
      tabs.push({ id: 'investors', name: 'CRM', icon: Users });
    } else {
      tabs.push({ id: 'portfolio', name: 'Portfolio', icon: PieChart });
    }

    // Pick 4th primary tab (Calendar / Tasks if allowed, else Reports, else another default)
    if (['Owner', 'Admin', 'Accountant', 'InvestmentManager'].includes(role)) {
      tabs.push({ id: 'tasks-calendar', name: 'Tasks', icon: Calendar });
    } else {
      tabs.push({ id: 'dashboard', name: 'Home', icon: LayoutDashboard }); // fallback or placeholder
    }

    // Filter duplicates just in case
    const seen = new Set();
    return tabs.filter(t => {
      const isVisible = allItems.find(ai => ai.id === t.id)?.roles.includes(role);
      if (!isVisible || seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  };

  const primaryTabs = getPrimaryTabs();

  return (
    <>
      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#16171a]/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around pb-safe z-40 lg:hidden px-2 shadow-2xl shadow-black">
        {primaryTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setDrawerOpen(false);
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors relative cursor-pointer ${
                isActive ? 'text-emerald-400' : 'text-white/40 hover:text-white/75'
              }`}
            >
              <Icon size={20} className={isActive ? 'scale-110 transition-transform duration-200 text-emerald-400' : ''} />
              <span className="text-[10px] font-medium tracking-tight truncate max-w-full">{tab.name}</span>
              {isActive && (
                <span className="absolute bottom-1.5 h-1 w-1 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}

        {/* Dynamic More Button for Drawer */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors cursor-pointer ${
            drawerOpen ? 'text-emerald-400' : 'text-white/40 hover:text-white/75'
          }`}
        >
          <Menu size={20} className={drawerOpen ? 'rotate-90 transition-transform duration-200' : ''} />
          <span className="text-[10px] font-medium tracking-tight">More</span>
        </button>
      </div>

      {/* Swipe Drawer for Accessory Tabs */}
      {drawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300 animate-fade-in"
          />

          {/* Slide-Up Bottom Drawer */}
          <div
            className="fixed bottom-0 inset-x-0 bg-[#16171a] border-t border-white/5 rounded-t-[2.5rem] z-50 lg:hidden pb-12 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl transition-transform duration-300 animate-slide-up"
          >
              {/* Drag Handle & Close */}
              <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-white/40 font-mono font-bold uppercase tracking-wider">Access Directory</span>
                  <span className="text-sm font-bold text-white font-sans mt-0.5">Explore Wealth Ledger</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Bento Grid of Available Tabs */}
              <div className="px-6 py-4 grid grid-cols-3 gap-3">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab.toLowerCase() === item.id.toLowerCase();
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setDrawerOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-950/20'
                          : 'bg-[#0a0b0d] hover:bg-[#111214] border-white/5 text-white/70 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/60'
                      } mb-2.5`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-bold font-sans text-center leading-tight tracking-tight line-clamp-2">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SEC-ALPHA Emergency Protocol (Owner only) */}
              {role === 'Owner' && onResetState && (
                <div className="mt-2 px-6 pt-4 border-t border-white/5 mx-6 space-y-2.5">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[9px] text-red-500 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      SEC-ALPHA Emergency Protocol
                    </span>
                    <span className="text-[10px] text-white/40 leading-normal font-sans">
                      Wipe all database records instantly to start with an absolutely clean slate.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('CRITICAL PROTOCOL TRIGGERED:\n\nAre you sure you want to permanently execute the SEC-ALPHA Emergency Wipe and remove all database records? This cannot be undone.')) {
                        onResetState('clean');
                        setDrawerOpen(false);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Wipe Database (Remove Everything)
                  </button>
                </div>
              )}

            {/* Quick Info Bar in Sheet */}
            <div className="mt-4 px-6 pt-4 border-t border-white/5 mx-6 flex items-center justify-between text-[10px] font-mono text-white/30">
              <span>Secure Mobile Client</span>
              <span>SEC-ALPHA • {role}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
