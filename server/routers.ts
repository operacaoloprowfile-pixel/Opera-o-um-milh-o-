import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getUserFinancialInfo,
  createUserFinancialInfo,
  updateBalance,
  updateFinancialInfo,
  getUserTransactions,
  createTransaction,
  getUserInvestments,
  createInvestment,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
  getUserById,
} from "./db";
import { TRPCError } from "@trpc/server";
import { registerUser, loginUser, generateJWT } from "./auth";
import { initiateDepositLofyPay, initiateWithdrawalLofyPay } from "./lofypay-gateway";
import { COOKIE_NAME } from "@shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    
    // Register with CPF, email and password
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        password: z.string().min(6),
        referralCode: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { userId, token } = await registerUser(
            input.name,
            input.email,
            input.cpf,
            input.password,
            input.referralCode
          );

          const user = await getUserById(userId);
          if (!user) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to retrieve user",
            });
          }

          return {
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              cpf: user.cpf,
              referralCode: user.referralCode,
            },
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "Registration failed",
          });
        }
      }),

    // Login with CPF and password
    login: publicProcedure
      .input(z.object({
        cpf: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const { userId, token, user } = await loginUser(input.cpf, input.password);
          const fullUser = await getUserById(userId);
          return {
            success: true,
            token,
            user: {
              ...user,
              referralCode: fullUser?.referralCode,
            },
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: error.message || "Login failed",
          });
        }
      }),
  }),

  // Financial operations
  financial: router({
    // Get user's financial info (saldo, total investido, ganho acumulado)
    getInfo: protectedProcedure.query(async ({ ctx }) => {
      const info = await getUserFinancialInfo(ctx.user.id);
      if (!info) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Financial info not found",
        });
      }
      return {
        balance: info.balance / 100,
        totalInvested: info.totalInvested / 100,
        totalGain: info.totalGain / 100,
      };
    }),

    // Get transaction history
    getTransactions: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        const transactions = await getUserTransactions(ctx.user.id, input.limit);
        return transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount / 100,
          description: t.description,
          status: t.status,
          createdAt: t.createdAt,
        }));
      }),

    // Deposit with LofyPay integration
    deposit: protectedProcedure
      .input(z.object({ 
        amount: z.number().positive(),
        paymentMethod: z.enum(["pix", "card"]).default("pix")
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserById(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const info = await getUserFinancialInfo(ctx.user.id);
        if (!info) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Financial info not found",
          });
        }

        try {
          // Integrate with LofyPay gateway
          const lofyPayResult = await initiateDepositLofyPay({
            amount: input.amount,
            paymentMethod: input.paymentMethod,
            userId: ctx.user.id,
            userEmail: user.email || "user@example.com",
            userName: user.name || "User",
          });

          // Create pending transaction record
          await createTransaction(
            ctx.user.id,
            "deposit",
            Math.round(input.amount * 100),
            `Depósito de R$ ${input.amount.toFixed(2)} via ${input.paymentMethod.toUpperCase()}`
          );

          return {
            success: true,
            transactionId: lofyPayResult.transactionId,
            paymentLink: lofyPayResult.paymentLink,
            message: lofyPayResult.message,
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Falha ao processar depósito",
          });
        }
      }),

    // Simulate daily yield (Admin or Manual trigger for demo)
    simulateYield: protectedProcedure.mutation(async ({ ctx }) => {
      const { processDailyYield } = await import("./yield-cron");
      await processDailyYield();
      return { success: true };
    }),

    // Get LofyPay transaction status
    getTransactionStatus: protectedProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        const { getTransactionStatusLofyPay } = await import("./lofypay-gateway");
        const status = await getTransactionStatusLofyPay(input.transactionId);
        return status;
      }),

    // Withdraw with LofyPay integration
    withdraw: protectedProcedure
      .input(z.object({ 
        amount: z.number().positive(),
        pixKey: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserById(ctx.user.id);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const info = await getUserFinancialInfo(ctx.user.id);
        if (!info) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Financial info not found",
          });
        }

        const amountInCents = Math.round(input.amount * 100);
        if (info.balance < amountInCents) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Saldo insuficiente para saque",
          });
        }

        try {
          // Integrate with LofyPay gateway
          const lofyPayResult = await initiateWithdrawalLofyPay({
            amount: input.amount,
            userId: ctx.user.id,
            userEmail: user.email || "user@example.com",
            pixKey: input.pixKey,
          });

          // Deduct amount from balance immediately
          const newBalance = info.balance - amountInCents;
          await updateBalance(ctx.user.id, newBalance);

          // Create transaction record
          await createTransaction(
            ctx.user.id,
            "withdraw",
            amountInCents,
            `Saque de R$ ${input.amount.toFixed(2)} via PIX`
          );

          return {
            success: true,
            transactionId: lofyPayResult.transactionId,
            newBalance: newBalance / 100,
            message: lofyPayResult.message,
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Falha ao processar saque",
          });
        }
      }),
  }),

  // Investment operations
  investments: router({
    // List user's investments
    list: protectedProcedure.query(async ({ ctx }) => {
      const investments = await getUserInvestments(ctx.user.id);
      return investments.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        amountInvested: inv.amountInvested / 100,
        currentValue: inv.currentValue / 100,
        profit: (inv.currentValue - inv.amountInvested) / 100,
        profitPercentage: inv.amountInvested > 0 
          ? ((inv.currentValue - inv.amountInvested) / inv.amountInvested * 100).toFixed(2)
          : "0.00",
      }));
    }),

    // Buy investment
    buy: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.string(),
        amount: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const info = await getUserFinancialInfo(ctx.user.id);
        if (!info) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Financial info not found",
          });
        }

        const amountInCents = Math.round(input.amount * 100);
        if (info.balance < amountInCents) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient balance",
          });
        }

        // Deduct from balance
        const newBalance = info.balance - amountInCents;
        await updateBalance(ctx.user.id, newBalance);

        // Create investment
        const investment = await createInvestment(
          ctx.user.id,
          input.name,
          input.type,
          amountInCents,
          amountInCents
        );

        // Record transaction
        await createTransaction(
          ctx.user.id,
          "investment_buy",
          amountInCents,
          `Investimento em ${input.name}`
        );

        return {
          success: true,
          investment: {
            id: investment.id,
            name: investment.name,
            type: investment.type,
            amountInvested: investment.amountInvested / 100,
            currentValue: investment.currentValue / 100,
          },
          newBalance: newBalance / 100,
        };
      }),

    // Sell investment
    sell: protectedProcedure
      .input(z.object({
        investmentId: z.number(),
        amount: z.number().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const investment = await getInvestmentById(input.investmentId, ctx.user.id);
        if (!investment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Investment not found",
          });
        }

        const amountInCents = Math.round(input.amount * 100);
        if (investment.currentValue < amountInCents) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient investment value",
          });
        }

        const info = await getUserFinancialInfo(ctx.user.id);
        if (!info) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Financial info not found",
          });
        }

        // Add to balance
        const newBalance = info.balance + amountInCents;
        await updateBalance(ctx.user.id, newBalance);

        // Update investment
        const newInvestmentValue = investment.currentValue - amountInCents;
        if (newInvestmentValue <= 0) {
          await deleteInvestment(investment.id);
        } else {
          await updateInvestment(investment.id, { currentValue: newInvestmentValue });
        }

        // Record transaction
        await createTransaction(
          ctx.user.id,
          "investment_sell",
          amountInCents,
          `Resgate de ${investment.name}`
        );

        return {
          success: true,
          newBalance: newBalance / 100,
        };
      }),

    // Get single investment details
    getById: protectedProcedure
      .input(z.object({ investmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const investment = await getInvestmentById(input.investmentId, ctx.user.id);
        if (!investment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Investment not found",
          });
        }

        return {
          id: investment.id,
          name: investment.name,
          type: investment.type,
          amountInvested: investment.amountInvested / 100,
          currentValue: investment.currentValue / 100,
          profit: (investment.currentValue - investment.amountInvested) / 100,
          profitPercentage: investment.amountInvested > 0
            ? ((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2)
            : "0.00",
          createdAt: investment.createdAt,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
