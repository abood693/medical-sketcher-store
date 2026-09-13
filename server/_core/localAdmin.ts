import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function verifyPassword(password: string, encoded: string) {
  const [salt, expected] = encoded.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function registerLocalAdminRoute(app: Express) {
  app.post("/api/local-admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    if (!ENV.adminUsername || !ENV.adminPasswordHash) {
      res.status(503).json({ error: "Owner login is not configured" });
      return;
    }
    if (typeof username !== "string" || typeof password !== "string" || username !== ENV.adminUsername || !verifyPassword(password, ENV.adminPasswordHash)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const openId = "local-admin";
    await db.upsertUser({ openId, name: username, loginMethod: "local-password", lastSignedIn: new Date() });
    const token = await sdk.createSessionToken(openId, { name: username, expiresInMs: ONE_YEAR_MS });
    res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
    res.json({ success: true });
  });
}
