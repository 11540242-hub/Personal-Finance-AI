
import { BankAccount, Category, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c1', name: '薪資', type: 'INCOME' },
  { id: 'c2', name: '獎金', type: 'INCOME' },
  { id: 'c3', name: '投資', type: 'INCOME' },
  { id: 'c4', name: '飲食', type: 'EXPENSE' },
  { id: 'c5', name: '交通', type: 'EXPENSE' },
  { id: 'c6', name: '娛樂', type: 'EXPENSE' },
  { id: 'c7', name: '居住', type: 'EXPENSE' },
  { id: 'c8', name: '購物', type: 'EXPENSE' },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'a1', name: '主要帳戶', bankName: '國泰世華', balance: 50000, createdAt: Date.now() },
  { id: 'a2', name: '儲蓄帳戶', bankName: '玉山銀行', balance: 120000, createdAt: Date.now() },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'a1', amount: 35000, type: 'INCOME', categoryId: 'c1', note: '1月薪資', date: Date.now() - 86400000 * 5 },
  { id: 't2', accountId: 'a1', amount: 150, type: 'EXPENSE', categoryId: 'c4', note: '午餐', date: Date.now() - 86400000 * 2 },
  { id: 't3', accountId: 'a1', amount: 600, type: 'EXPENSE', categoryId: 'c5', note: '加油', date: Date.now() - 86400000 },
];
