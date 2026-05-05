import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  cpf: varchar("cpf", { length: 14 }).unique(),
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User CPF and financial info
 * Separated for security and compliance
 */
export const userFinancialInfo = mysqlTable("userFinancialInfo", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  balance: int("balance").default(0).notNull(),
  totalInvested: int("totalInvested").default(0).notNull(),
  totalGain: int("totalGain").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserFinancialInfo = typeof userFinancialInfo.$inferSelect;
export type InsertUserFinancialInfo = typeof userFinancialInfo.$inferInsert;

/**
 * Transactions table for tracking all financial operations
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  type: mysqlEnum("type", ["deposit", "withdraw", "investment_buy", "investment_sell"]).notNull(),
  amount: int("amount").notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Investments table for tracking user investments
 */
export const investments = mysqlTable("investments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  amountInvested: int("amountInvested").notNull(),
  currentValue: int("currentValue").notNull(),
  externalId: varchar("externalId", { length: 255 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = typeof investments.$inferInsert;
