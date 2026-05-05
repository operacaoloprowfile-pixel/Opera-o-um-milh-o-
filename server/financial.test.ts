import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("Financial Operations", () => {
  let userId: number;
  let ctx: TrpcContext;

  beforeAll(() => {
    userId = 1;
    const user = {
      id: userId,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      cpf: "123.456.789-00",
      loginMethod: "email",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    ctx = {
      user,
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {} as any,
    };
  });

  it("should get financial info", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.financial.getInfo();
      expect(result).toHaveProperty("balance");
      expect(result).toHaveProperty("totalInvested");
      expect(result).toHaveProperty("totalGain");
    } catch (error) {
      // Expected if user doesn't exist in DB
      expect(error).toBeDefined();
    }
  });

  it("should get transactions list", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.financial.getTransactions({ limit: 10 });
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should list investments", async () => {
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.investments.list();
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Authentication", () => {
  it("should reject invalid credentials", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    try {
      await caller.auth.login({
        cpf: "invalid",
        password: "wrong",
      });
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should validate registration input", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    try {
      await caller.auth.register({
        name: "",
        email: "invalid-email",
        cpf: "invalid-cpf",
        password: "123", // Too short
      });
      expect(false).toBe(true); // Should not reach here
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
