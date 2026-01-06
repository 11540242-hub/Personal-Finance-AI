
import React, { useState } from 'react';
import { Transaction, BankAccount, Category } from '../types';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

// Fix: Updated interface to match props passed from App.tsx
interface TransactionListProps {
  transactions: Transaction[];
  onAdd: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  accounts: BankAccount[];
  categories: Category[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onAdd, accounts, categories }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTx, setNewTx] = useState({
    accountId: accounts[0]?.id || '',
    amount: 0,
    type: 'EXPENSE' as const,
    categoryId: categories[0]?.id || '',
    note: ''
  });

  // Fix: Updated to call onAdd prop instead of local setTransactions
  const addTx = async () => {
    await onAdd({
      ...newTx,
      date: Date.now()
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">收支紀錄</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> 新增收支
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">帳戶</label>
            <select className="w-full border rounded-lg p-2" value={newTx.accountId} onChange={e => setNewTx({...newTx, accountId: e.target.value})}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">類型</label>
            <select className="w-full border rounded-lg p-2" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as any})}>
              <option value="EXPENSE">支出</option>
              <option value="INCOME">收入</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">金額</label>
            <input type="number" className="w-full border rounded-lg p-2" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">分類</label>
            <select className="w-full border rounded-lg p-2" value={newTx.categoryId} onChange={e => setNewTx({...newTx, categoryId: e.target.value})}>
              {categories.filter(c => c.type === newTx.type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addTx} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg">儲存</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg">取消</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4">帳戶</th>
                <th className="px-6 py-4">分類</th>
                <th className="px-6 py-4">說明</th>
                <th className="px-6 py-4 text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(tx => {
                const acc = accounts.find(a => a.id === tx.accountId);
                const cat = categories.find(c => c.id === tx.categoryId);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{format(tx.date, 'yyyy/MM/dd')}</td>
                    <td className="px-6 py-4 font-medium">{acc?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {cat?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{tx.note}</td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
