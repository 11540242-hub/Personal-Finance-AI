
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppState } from '../types';

interface ReportViewProps {
  state: Omit<AppState, 'user' | 'isDemo'>;
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

export const ReportView: React.FC<ReportViewProps> = ({ state }) => {
  const { transactions, categories } = state;

  const expenseData = categories
    .filter(c => c.type === 'EXPENSE')
    .map(c => ({
      name: c.name,
      value: transactions.filter(t => t.categoryId === c.id).reduce((sum, t) => sum + t.amount, 0)
    }))
    .filter(d => d.value > 0);

  const monthlyData = [
    { name: '1月', income: 45000, expense: 32000 },
    { name: '2月', income: 48000, expense: 35000 },
    // Simplified for demo
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">統計報表</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-6">收支趨勢</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="收入" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="支出" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-6">支出佔比分析</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-500">{d.name}: ${d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
