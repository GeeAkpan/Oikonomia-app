import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  PieChart,
  ArrowDownUp,
  CalendarDays,
  Bot,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  role,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  onClose
}: SidebarProps) {
  // Define available menu items based on roles
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer', 'Investor'] },
    { id: 'investors', name: 'Investor CRM', icon: Users, roles: ['Owner', 'Admin', 'InvestmentManager', 'Viewer'] },
    { id: 'ledger', name: 'Fund Ledger', icon: FileSpreadsheet, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] },
    { id: 'portfolio', name: 'Portfolio Engine', icon: PieChart, roles: ['Owner', 'Admin', 'InvestmentManager', 'Viewer'] },
    { id: 'borrowing', name: 'Internal Borrowing', icon: ArrowDownUp, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] },
    { id: 'weekly-close', name: 'Weekly Closing', icon: ShieldCheck, roles: ['Owner', 'Admin', 'Accountant'] },
    { id: 'ai-analyst', name: 'AI Financial Analyst', icon: Bot, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer', 'Investor'] },
    { id: 'tasks-calendar', name: 'Tasks & Calendar', icon: Calendar, roles: ['Owner', 'Admin', 'Accountant', 'InvestmentManager', 'Viewer'] },
    { id: 'reports', name: 'Statements & Reports', icon: Layers, roles: ['Owner', 'Admin', 'Accountant', 'Viewer'] }
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`bg-[#16171a] border-r border-white/5 text-zinc-100 h-screen transition-transform duration-300 flex flex-col justify-between fixed inset-y-0 left-0 lg:sticky top-0 z-50 lg:z-30 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64 lg:w-auto'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center font-sans font-extrabold text-sm text-black tracking-widest shadow-lg shadow-emerald-500/20">
                OK
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-base tracking-widest text-white uppercase">Oikonomia</span>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider font-semibold uppercase">Wealth Ledger</span>
                </div>
              )}
            </div>

            {/* Close / Collapse toggles */}
            <div className="flex items-center gap-1">
              {mobileOpen && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              {!mobileOpen && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden lg:block p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/5 text-emerald-400 border-l-2 border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-white/40 group-hover:text-zinc-100'} />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Badge */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 text-xs flex-shrink-0">
              {role[0]}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold font-mono">Role Access</span>
                <span className="text-xs font-bold text-white truncate">{role}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
