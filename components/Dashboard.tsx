
import React from 'react';
import { BankAccount, Transaction, Category } from '../types';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DashboardProps {
  state: {
    accounts: BankAccount[];
    transactions: Transaction[];
    categories: Category[];
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { accounts, transactions, categories } = state;
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const incomeThisMonth = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseThisMonth = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold">歡迎回來！</h2>
        <p className="text-slate-500">這是您目前的財務概況</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400">總資產</span>
          </div>
          <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400">本月收入</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">+${incomeThisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-semibold text-slate-400">本月支出</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">-${expenseThisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold">最近紀錄</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">查看全部</button>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.slice(0, 5).map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            const acc = accounts.find(a => a.id === t.accountId);
            return (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold">{cat?.name || '未分類'}</p>
                    <p className="text-xs text-slate-400">{acc?.name} · {format(t.date, 'yyyy/MM/dd')}</p>
                  </div>
                </div>
                <div className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
