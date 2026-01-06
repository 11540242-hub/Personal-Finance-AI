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
  doc 
} from 'firebase/firestore';
import { AppState, UserProfile, BankAccount, Transaction, Category } from './types';
import { DEFAULT_CATEGORIES, MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from './mockData';

const STORAGE_KEY = 'finance_manager_data';

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

  // Auth Observer
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
          setIsDemo(true);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Data Sync Logic
  useEffect(() => {
    if (isDemo) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      } else {
        setState({
          accounts: MOCK_ACCOUNTS,
          transactions: MOCK_TRANSACTIONS,
          categories: DEFAULT_CATEGORIES
        });
      }
    } else if (user && db) {
      const accRef = collection(db, `users/${user.uid}/accounts`);
      const transRef = collection(db, `users/${user.uid}/transactions`);
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

  useEffect(() => {
    if (isDemo) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isDemo]);

  // Handlers
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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold">載入中...</div>;
  }

  if (!user && !isDemo) {
    return <AuthPage onDemoMode={() => setIsDemo(true)} />;
  }

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      isDemo={isDemo} 
      onSwitchMode={() => setIsDemo(!isDemo)}
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