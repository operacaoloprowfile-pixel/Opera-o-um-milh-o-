import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userFinancialInfo, transactions, investments, UserFinancialInfo, Transaction, Investment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Financial Info queries
export async function getUserFinancialInfo(userId: number): Promise<UserFinancialInfo | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userFinancialInfo).where(eq(userFinancialInfo.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserFinancialInfo(userId: number, cpf: string): Promise<UserFinancialInfo> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userFinancialInfo).values({
    userId,
    cpf,
    balance: 0,
    totalInvested: 0,
    totalGain: 0,
    totalDeposited: 0,
    dailyYieldRate: 100, // 1% padrão
  });

  const result = await db.select().from(userFinancialInfo).where(eq(userFinancialInfo.userId, userId)).limit(1);
  if (!result[0]) throw new Error("Failed to create financial info");
  return result[0];
}

export async function updateBalance(userId: number, newBalance: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userFinancialInfo).set({ balance: newBalance }).where(eq(userFinancialInfo.userId, userId));
}

export async function updateFinancialInfo(userId: number, updates: Partial<UserFinancialInfo>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userFinancialInfo).set(updates).where(eq(userFinancialInfo.userId, userId));
}

export async function getUserByReferralCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.referralCode, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Transaction queries
export async function createTransaction(
  userId: number,
  type: "deposit" | "withdraw" | "investment_buy" | "investment_sell",
  amount: number,
  description?: string
): Promise<Transaction> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(transactions).values({
    userId,
    type,
    amount,
    description,
    status: "completed",
  });

  const inserted = await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(1);
  if (!inserted[0]) throw new Error("Failed to create transaction");
  return inserted[0];
}

export async function getUserTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)).limit(limit);
}

// Investment queries
export async function createInvestment(
  userId: number,
  name: string,
  type: string,
  amountInvested: number,
  currentValue: number,
  externalId?: string
): Promise<Investment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(investments).values({
    userId,
    name,
    type,
    amountInvested,
    currentValue,
    externalId,
  });

  const inserted = await db.select().from(investments).where(eq(investments.userId, userId)).orderBy(desc(investments.createdAt)).limit(1);
  if (!inserted[0]) throw new Error("Failed to create investment");
  return inserted[0];
}

export async function getUserInvestments(userId: number): Promise<Investment[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(investments).where(eq(investments.userId, userId));
}

export async function getInvestmentById(investmentId: number, userId: number): Promise<Investment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(investments).where(and(eq(investments.id, investmentId), eq(investments.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateInvestment(investmentId: number, updates: Partial<Investment>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(investments).set(updates).where(eq(investments.id, investmentId));
}

export async function deleteInvestment(investmentId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(investments).where(eq(investments.id, investmentId));
}

export async function updateUser(userId: number, updates: Partial<User>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set(updates).where(eq(users.id, userId));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByCPF(cpf: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.cpf, cpf)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithAuth(
  name: string,
  email: string,
  cpf: string,
  passwordHash: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  await db.insert(users).values({
    name,
    email,
    cpf,
    passwordHash,
    loginMethod: "email",
    role: "user",
    referralCode,
  });

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!result[0]) throw new Error("Failed to create user");

  await createUserFinancialInfo(result[0].id, cpf);

  return result[0];
}
