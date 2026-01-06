
import { GoogleGenAI } from "@google/genai";
import { BankAccount, Transaction, Category } from "../types";

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  const apiKey = (process.env.API_KEY as string) || '';
  
  if (!apiKey) {
    return "尚未設定 API 金鑰。系統目前處於展示模式，無法使用 AI 分析功能。請在 GitHub Secrets 中設定 API_KEY。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
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
      作為一位專業的個人理財顧問，請分析以下財務數據並給予 3 點具體且可執行的建議：
      
      【資產概況】
      - 總資產: ${totalBalance.toLocaleString()} 元
      - 本期總收入: ${income.toLocaleString()} 元
      - 本期總支出: ${expense.toLocaleString()} 元
      
      【支出分類統計】
      ${JSON.stringify(categorySummary, null, 2)}
      
      請以繁體中文回答，口吻專業、富有洞察力且友善。請針對收支平衡與支出佔比進行重點評論。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return response.text || "AI 暫時無法產生回應，請稍後再試。";
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "呼叫 AI 時發生錯誤。請確認您的 API Key 是否正確設定且具備 gemini-3-pro-preview 的存取權限。";
  }
};
