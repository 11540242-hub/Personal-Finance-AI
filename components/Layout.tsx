import React from 'react';
import { LayoutDashboard, CreditCard, ReceiptText, BarChart3, Bot, LogOut, ShieldAlert, ShieldCheck, Tag } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: any) => void;
  isDemo: boolean;
  onSwitchMode: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isDemo, onSwitchMode, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: '總覽', icon: LayoutDashboard },
    { id: 'accounts', label: '帳戶管理', icon: CreditCard },
    { id: 'transactions', label: '收支紀錄', icon: ReceiptText },
    { id: 'categories', label: '分類管理', icon: Tag },
    { id: 'reports', label: '統計報表', icon: BarChart3 },
    { id: 'ai', label: 'AI 理財顧問', icon: Bot },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-indigo-100">
      {/* Sidebar */}
      <aside className="w-68 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 shadow-2xl z-10">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-xl shadow-lg shadow-indigo-500/30">💰</span>
            SmartFinance
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-800/40 m-6 rounded-2xl border border-slate-700/50 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isDemo ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isDemo ? '展示模式' : '正式模式'}</span>
              <span className="text-xs font-medium text-slate-300 truncate">{isDemo ? '離線存取中' : user?.email}</span>
            </div>
          </div>
          <button 
            onClick={onSwitchMode}
            className="w-full text-xs bg-slate-700/50 hover:bg-indigo-600 py-2.5 rounded-xl transition-all font-bold border border-slate-600/50 hover:border-indigo-400 shadow-inner"
          >
            切換到{isDemo ? '正式' : '展示'}模式
          </button>
          {!isDemo && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 text-rose-400 text-xs hover:text-rose-300 py-1 transition-colors font-bold"
            >
              <LogOut size={14} /> 登出系統
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};