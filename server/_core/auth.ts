// auth.ts — sistema de autenticação próprio (substitui Manus OAuth)
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

// Hash de senha com HMAC-SHA256 (sem bcrypt para manter zero deps extras)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", ENV.cookieSecret)
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = createHmac("sha256", ENV.cookieSecret)
    .update(salt + password)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function createSessionToken(openId: string, name: string): Promise<string> {
  const secret = new TextEncoder().encode(ENV.cookieSecret);
  return new SignJWT({ openId, appId: "reabilite", name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1y")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ openId: string; name: string } | null> {
  try {
    const secret = new TextEncoder().encode(ENV.cookieSecret);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const { openId, name } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || typeof name !== "string") return null;
    return { openId, name };
  } catch {
    return null;
  }
}

export { ONE_YEAR_MS };
