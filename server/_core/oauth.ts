// oauth.ts — login/cadastro por email+senha (sem Manus)
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { hashPassword, verifyPassword, createSessionToken, ONE_YEAR_MS } from "./auth";
import { COOKIE_NAME } from "@shared/const";
import { nanoid } from "nanoid";

export function registerOAuthRoutes(app: Express) {
  // Cadastro
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email e password são obrigatórios" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres" });
      return;
    }

    try {
      const existing = await db.getUserByEmail(email);
      if (existing) {
        res.status(409).json({ error: "Email já cadastrado" });
        return;
      }

      const openId = `local_${nanoid(16)}`;
      const passwordHash = hashPassword(password);

      await db.upsertUser({
        openId,
        userType: "patient",
        name,
        email,
        loginMethod: "email",
        passwordHash,
        lastSignedIn: new Date(),
      });

      const token = await createSessionToken(openId, name);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, name });
    } catch (error) {
      console.error("[Auth] Register failed", error);
      res.status(500).json({ error: "Erro ao cadastrar" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({ error: "email e password são obrigatórios" });
      return;
    }

    try {
      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Email ou senha incorretos" });
        return;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        res.status(401).json({ error: "Email ou senha incorretos" });
        return;
      }

      await db.upsertUser({ openId: user.openId, userType: "patient", lastSignedIn: new Date() });

      const token = await createSessionToken(user.openId, user.name ?? email);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, name: user.name });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  });
}
