
import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, ShieldAlert } from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthPageProps {
  onDemoMode: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onDemoMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase 未配置，請使用展示模式');
      return;
    }
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || '認證失敗');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 bg-indigo-600 text-white text-center">
          <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-2xl font-bold">SmartFinance</h1>
          <p className="text-indigo-100 mt-2">您的個人智能財管專家</p>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
            >
              登入
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
            >
              註冊
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="電子郵件" 
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="密碼" 
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
            >
              {isLogin ? <><LogIn size={20} /> 立即登入</> : <><UserPlus size={20} /> 註冊帳號</>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-4">不想註冊？您可以先嘗試</p>
            <button 
              onClick={onDemoMode}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <ShieldAlert size={18} className="text-amber-500" /> 進入展示模式
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
