
import { GoogleGenAI } from "@google/genai";
import { BankAccount, Transaction, Category } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "尚未設定 API 金鑰，無法提供 AI 建議。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare data summary for AI
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    
    const categorySummary = transactions.reduce((acc: any, t) => {
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
    return "呼叫 AI 時發生錯誤，請稍後再試。";
  }
};
