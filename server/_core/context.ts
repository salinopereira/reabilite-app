// context.ts — sem dependência do Manus SDK
import type { Request, Response } from "express";
import * as db from "../db";
import { verifySessionToken } from "./auth";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookies } from "cookie";
import type { User } from "../../drizzle/schema";

export type Context = {
  req: Request;
  res: Response;
  user: User | null;
};

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  const raw = req.headers.cookie ?? "";
  const cookies = parseCookies(raw);
  const token = cookies[COOKIE_NAME];

  let user: User | null = null;

  if (token) {
    try {
      const session = await verifySessionToken(token);
      if (session) {
        user = (await db.getUserByOpenId(session.openId)) ?? null;
      }
    } catch {
      // token inválido — user permanece null
    }
  }

  return { req, res, user };
}
