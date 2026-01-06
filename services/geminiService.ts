import { GoogleGenAI } from "@google/genai";
import { BankAccount, Transaction, Category } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    return "尚未設定 API 金鑰（API_KEY 未找到）。系統目前處於展示模式，無法存取 AI 功能。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    const categorySummary = transactions.reduce((acc: Record<string, number>, t) => {
      const cat = categories.find(c => c.id === t.categoryId);
      const name = cat ? cat.name : '未分類';
      acc[name] = (acc[name] || 0) + t.amount;
      return acc;
    }, {});

    const prompt = `
      作為一位資深理財顧問，請分析以下財務狀況並給予 3 點具體建議。
      目前總資產: ${totalBalance} 元
      本期總收入: ${income} 元
      本期總支出: ${expense} 元
      支出分類統計: ${JSON.stringify(categorySummary)}
      
      請以繁體中文回答，口吻專業且親切。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return response.text || "AI 暫時無法產生回應。";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "呼叫 AI 時發生錯誤，請確認 API Key 是否有效。";
  }
};