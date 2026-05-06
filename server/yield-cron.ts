import { getDb, getUserFinancialInfo, updateFinancialInfo, createTransaction, getUserInvestments, updateInvestment } from "./db";
import { eq } from "drizzle-orm";
import { userFinancialInfo, investments } from "../drizzle/schema";

export async function processDailyYield() {
  const db = await getDb();
  if (!db) return;

  console.log("[Yield Cron] Starting daily yield process...");

  // 1. Process yield for investments
  const allInvestments = await db.select().from(investments);
  for (const inv of allInvestments) {
    const finInfo = await getUserFinancialInfo(inv.userId);
    if (!finInfo) continue;

    const rate = finInfo.dailyYieldRate / 10000; // Converte base 100 para decimal (ex: 100 = 0.01)
    const yieldAmount = Math.round(inv.currentValue * rate);
    
    if (yieldAmount > 0) {
      const newValue = inv.currentValue + yieldAmount;
      await updateInvestment(inv.id, { currentValue: newValue });
      
      // Update total gain in financial info
      await updateFinancialInfo(inv.userId, { 
        totalGain: finInfo.totalGain + yieldAmount 
      });

      await createTransaction(
        inv.userId,
        "yield",
        yieldAmount,
        `Rendimento diário: ${inv.name} (+${(rate * 100).toFixed(2)}%)`
      );
    }
  }

  // 2. Process yield for balance (optional, but common in pyramid schemes)
  const allFinInfo = await db.select().from(userFinancialInfo);
  for (const fin of allFinInfo) {
    if (fin.balance > 0) {
      const rate = fin.dailyYieldRate / 10000;
      const yieldAmount = Math.round(fin.balance * rate);
      
      if (yieldAmount > 0) {
        await updateFinancialInfo(fin.userId, {
          balance: fin.balance + yieldAmount,
          totalGain: fin.totalGain + yieldAmount
        });

        await createTransaction(
          fin.userId,
          "yield",
          yieldAmount,
          `Rendimento diário sobre saldo (+${(rate * 100).toFixed(2)}%)`
        );
      }
    }
  }

  console.log("[Yield Cron] Daily yield process completed.");
}
