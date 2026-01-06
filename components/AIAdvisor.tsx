
import React, { useState } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { getFinancialAdvice } from '../services/geminiService';
import { AppState } from '../types';

interface AIAdvisorProps {
  state: Omit<AppState, 'user' | 'isDemo'>;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ state }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const res = await getFinancialAdvice(state.accounts, state.transactions, state.categories);
    setAdvice(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="text-indigo-600" /> AI 理財顧問
          </h2>
          <p className="text-slate-500">基於您的收支數據，提供量身定制的理財建議</p>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? '思考中...' : <><Sparkles size={20} /> 獲取新建議</>}
        </button>
      </div>

      <div className="bg-white min-h-[400px] rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center">
        {!advice && !loading ? (
          <div className="text-center space-y-4 max-w-md">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot size={40} />
            </div>
            <h3 className="text-xl font-bold">準備好優化您的財務了嗎？</h3>
            <p className="text-slate-500">點擊上方按鈕，AI 將分析您的消費習慣、資產配置，並提供專業建議。</p>
          </div>
        ) : loading ? (
          <div className="text-center space-y-4">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4" />
              <div className="h-4 w-48 bg-slate-100 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
            <p className="text-indigo-600 font-medium animate-bounce">AI 正在深度分析中...</p>
          </div>
        ) : (
          <div className="prose prose-indigo max-w-none w-full">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-600 text-white rounded-lg mt-1">
                  <Bot size={20} />
                </div>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                  {advice}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
