
import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, Building2 } from 'lucide-react';

// Fix: Updated interface to match props passed from App.tsx
interface AccountListProps {
  accounts: BankAccount[];
  onAdd: (acc: Omit<BankAccount, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AccountList: React.FC<AccountListProps> = ({ accounts, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', bankName: '', balance: 0 });

  // Fix: Updated to call onAdd prop instead of local setAccounts
  const addAccount = async () => {
    if (!newAcc.name || !newAcc.bankName) return;
    await onAdd({
      name: newAcc.name,
      bankName: newAcc.bankName,
      balance: Number(newAcc.balance),
      createdAt: Date.now()
    });
    setNewAcc({ name: '', bankName: '', balance: 0 });
    setIsAdding(false);
  };

  // Fix: Updated to call onDelete prop
  const removeAccount = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">帳戶管理</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> 新增帳戶
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">帳戶名稱</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2" 
              placeholder="e.g. 薪轉戶" 
              value={newAcc.name}
              onChange={e => setNewAcc({ ...newAcc, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">銀行名稱</label>
            <input 
              type="text" 
              className="w-full border rounded-lg p-2" 
              placeholder="e.g. 中國信託" 
              value={newAcc.bankName}
              onChange={e => setNewAcc({ ...newAcc, bankName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">初始餘額</label>
            <input 
              type="number" 
              className="w-full border rounded-lg p-2" 
              value={newAcc.balance}
              onChange={e => setNewAcc({ ...newAcc, balance: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addAccount} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">儲存</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg">取消</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                <button onClick={() => removeAccount(acc.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="font-bold text-lg">{acc.name}</h4>
            <p className="text-sm text-slate-400 mb-4">{acc.bankName}</p>
            <p className="text-2xl font-bold">${acc.balance.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
