import React, { useState } from 'react';
import { Category, TransactionType, UserProfile } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  isDemo: boolean;
  user: UserProfile | null;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories, isDemo, user }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', type: 'EXPENSE' as TransactionType });

  const addCategory = async () => {
    if (!newCat.name) return;
    
    if (isDemo) {
      const cat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        ...newCat
      };
      setCategories([...categories, cat]);
    } else if (user && db) {
      await addDoc(collection(db, `users/${user.uid}/categories`), newCat);
    }
    
    setNewCat({ name: '', type: 'EXPENSE' });
    setIsAdding(false);
  };

  const removeCategory = async (id: string) => {
    if (isDemo) {
      setCategories(categories.filter(c => c.id !== id));
    } else if (user && db) {
      await deleteDoc(doc(db, `users/${user.uid}/categories`, id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">分類管理</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> 新增分類
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">分類名稱</label>
            <input 
              type="text" 
              className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-600" 
              placeholder="e.g. 寵物" 
              value={newCat.name}
              onChange={e => setNewCat({ ...newCat, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">收支類型</label>
            <select 
              className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              value={newCat.type}
              onChange={e => setNewCat({ ...newCat, type: e.target.value as TransactionType })}
            >
              <option value="EXPENSE">支出</option>
              <option value="INCOME">收入</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">新增</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg">取消</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cat.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="font-medium text-slate-700">{cat.name}</span>
            </div>
            <button 
              onClick={() => removeCategory(cat.id)}
              className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};