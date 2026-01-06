
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  bankName: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
  date: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AppState {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  isDemo: boolean;
  user: UserProfile | null;
}
