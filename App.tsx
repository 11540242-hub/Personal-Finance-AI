import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AccountList } from './components/AccountList';
import { TransactionList } from './components/TransactionList';
import { ReportView } from './components/ReportView';
import { AIAdvisor } from './components/AIAdvisor';
import { CategoryManager } from './components/CategoryManager';
import { auth, db, isFirebaseEnabled } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { AppState, UserProfile, BankAccount, Transaction, Category } from './types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from './mockData';

const STORAGE_KEY = 'finance_manager_data_v2';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports' | 'ai' | 'categories'>('dashboard');
  
  const [state, setState] = useState<Omit<AppState, 'user' | 'isDemo'>>({
    accounts: [],
    transactions: [],
    categories: DEFAULT_CATEGORIES
  });

  // Firebase Auth 監聽
  useEffect(() => {
    if (isFirebaseEnabled() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
          setIsDemo(false);
        } else {
          setUser(null);
          // 若無使用者且 Firebase 已啟用，則預設進入 Demo
          setIsDemo(true);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // 資料同步邏輯
  useEffect(() => {
    if (isDemo) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch {
          setState({ accounts: MOCK_ACCOUNTS, transactions: MOCK_TRANSACTIONS, categories: DEFAULT_CATEGORIES });
        }
      } else {
        setState({
          accounts: MOCK_ACCOUNTS,
          transactions: MOCK_TRANSACTIONS,
          categories: DEFAULT_CATEGORIES
        });
      }
    } else if (user && db) {
      const accRef = collection(db, `users/${user.uid}/accounts`);
      const transRef = query(collection(db, `users/${user.uid}/transactions`), orderBy('date', 'desc'));
      const catRef = collection(db, `users/${user.uid}/categories`);

      const unsubAcc = onSnapshot(accRef, (snapshot) => {
        const accounts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BankAccount));
        setState(prev => ({ ...prev, accounts }));
      });

      const unsubTrans = onSnapshot(transRef, (snapshot) => {
        const transactions = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
        setState(prev => ({ ...prev, transactions }));
      });

      const unsubCat = onSnapshot(catRef, (snapshot) => {
        const cats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
        setState(prev => ({ ...prev, categories: cats.length > 0 ? cats : DEFAULT_CATEGORIES }));
      });

      return () => {
        unsubAcc();
        unsubTrans();
        unsubCat();
      };
    }
  }, [isDemo, user]);

  // 本地快存 (Demo 模式)
  useEffect(() => {
    if (isDemo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isDemo]);

  const handleAddAccount = async (acc: Omit<BankAccount, 'id'>) => {
    if (isDemo) {
      const newAcc = { ...acc, id: Math.random().toString(36).substr(2, 9) };
      setState(prev => ({ ...prev, accounts: [...prev.accounts, newAcc] }));
    } else if (user && db) {
      await addDoc(collection(db, `users/${user.uid}/accounts`), acc);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (isDemo) {
      setState(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
    } else if (user && db) {
      await deleteDoc(doc(db, `users/${user.uid}/accounts`, id));
    }
  };

  const handleAddTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (isDemo) {
      const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
      setState(prev => ({ 
        ...prev, 
        transactions: [newTx, ...prev.transactions],
        accounts: prev.accounts.map(a => a.id === tx.accountId ? {
          ...a,
          balance: a.balance + (tx.type === 'INCOME' ? tx.amount : -tx.amount)
        } : a)
      }));
    } else if (user && db) {
      await addDoc(collection(db, `users/${user.uid}/transactions`), tx);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setView('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-bold">系統載入中...</p>
      </div>
    );
  }

  // 若未登入且未開啟展示模式，導向認證頁
  if (!user && !isDemo) {
    return <AuthPage onDemoMode={() => setIsDemo(true)} />;
  }

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      isDemo={isDemo} 
      onSwitchMode={() => {
        if (isDemo && !user) {
          // 如果是 Demo 想切正式但沒登入，去登入頁
          setIsDemo(false);
        } else {
          setIsDemo(!isDemo);
        }
      }}
      user={user}
      onLogout={handleLogout}
    >
      {view === 'dashboard' && <Dashboard state={state} />}
      {view === 'accounts' && <AccountList accounts={state.accounts} onAdd={handleAddAccount} onDelete={handleDeleteAccount} />}
      {view === 'transactions' && (
        <TransactionList 
          transactions={state.transactions} 
          onAdd={handleAddTransaction}
          accounts={state.accounts}
          categories={state.categories}
        />
      )}
      {view === 'reports' && <ReportView state={state} />}
      {view === 'ai' && <AIAdvisor state={state} />}
      {view === 'categories' && <CategoryManager categories={state.categories} setCategories={(c) => setState(prev => ({...prev, categories: c}))} isDemo={isDemo} user={user} />}
    </Layout>
  );
};

export default App;