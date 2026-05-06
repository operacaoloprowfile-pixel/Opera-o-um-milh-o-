import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getUserByEmail, getUserByCPF, createUserWithAuth, getUserById, getUserByReferralCode } from "./db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "wealthchain-secret-key-2024");

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateJWT(userId: number): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyJWT(token: string): Promise<{ userId: number } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: number };
  } catch (error) {
    return null;
  }
}

export async function registerUser(
  name: string,
  email: string,
  cpf: string,
  password: string,
  referralCode?: string
): Promise<{ userId: number; token: string }> {
  // Check if user already exists
  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const existingCPF = await getUserByCPF(cpf);
  if (existingCPF) {
    throw new Error("CPF already registered");
  }

  let referredById: number | null = null;
  if (referralCode) {
    const referrer = await getUserByReferralCode(referralCode);
    if (referrer) {
      referredById = referrer.id;
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await createUserWithAuth(name, email, cpf, passwordHash);

  if (referredById) {
    const { updateUser } = await import("./db");
    await updateUser(user.id, { referredById });
  }

  // Generate JWT
  const token = await generateJWT(user.id);

  return { userId: user.id, token };
}

export async function loginUser(
  cpf: string,
  password: string
): Promise<{ userId: number; token: string; user: any }> {
  const user = await getUserByCPF(cpf);
  if (!user || !user.passwordHash) {
    throw new Error("Invalid CPF or password");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid CPF or password");
  }

  const token = await generateJWT(user.id);

  return {
    userId: user.id,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
    },
  };
}
