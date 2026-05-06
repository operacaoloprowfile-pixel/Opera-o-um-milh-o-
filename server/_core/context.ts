import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { verifyJWT } from "../auth";
import { getUserById } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try cookie-based auth first (standard for this scaffold)
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Fallback to Bearer token auth (used by the custom login flow)
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const payload = verifyJWT(token);
        if (payload && typeof payload.userId === "number") {
          const dbUser = await getUserById(payload.userId);
          if (dbUser) {
            user = dbUser;
          }
        }
      } catch (jwtError) {
        console.error("[Auth] JWT verification failed:", jwtError);
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
