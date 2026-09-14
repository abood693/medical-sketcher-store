import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function verifyPassword(password: string, encoded: string) {
  const normalized = encoded.trim().replace(/^ADMIN_PASSWORD_HASH=/, "");
  const [salt, expected] = normalized.split(":");
  if (!salt || !expected) return false;
  try {
    const actual = crypto.scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(actual, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function registerLocalAdminRoute(app: Express) {
  const clearOwnerCookie = (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, {
      ...getSessionCookieOptions(req),
      maxAge: -1,
    });
  };

  app.get("/api/local-admin/session", async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (user.openId !== "local-admin" || user.role !== "admin") {
        res.status(401).json({ authenticated: false });
        return;
      }
      res.json({
        authenticated: true,
        user: { name: user.name, role: "admin" },
      });
    } catch {
      res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/local-admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    const missing = [
      !ENV.adminUsername && "ADMIN_USERNAME",
      !ENV.adminPasswordHash && "ADMIN_PASSWORD_HASH",
    ].filter(Boolean);
    if (missing.length > 0) {
      res.status(503).json({
        error: `Owner login is not configured. Missing: ${missing.join(", ")}. Set these values in the deployment secrets, then restart the server.`,
      });
      return;
    }
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.trim() !== ENV.adminUsername.trim() ||
      !verifyPassword(password, ENV.adminPasswordHash)
    ) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const openId = "local-admin";
    try {
      await db.upsertUser({
        openId,
        name: username,
        loginMethod: "local-password",
        role: "admin",
        lastSignedIn: new Date(),
      });
    } catch (error) {
      console.error(
        "[LocalAdmin] Failed to save owner in the database:",
        error
      );
      res.status(503).json({ error: "Owner database is not available" });
      return;
    }
    try {
      const token = await sdk.createSessionToken(openId, {
        name: username.trim(),
        expiresInMs: ONE_YEAR_MS,
      });
      res.cookie(COOKIE_NAME, token, {
        ...getSessionCookieOptions(req),
        maxAge: ONE_YEAR_MS,
      });
      // The frontend already supports an Authorization-header fallback for
      // browsers or reverse proxies that drop Set-Cookie. Keep the HttpOnly
      // cookie as the primary session path and return this token only so that
      // the owner dashboard can remain usable in that fallback case.
      res.json({ success: true, token });
    } catch (error) {
      console.error("[LocalAdmin] Failed to create owner session:", error);
      res
        .status(503)
        .json({ error: "Owner session is not configured. Check JWT_SECRET" });
    }
  });

  app.post("/api/local-admin/logout", (req: Request, res: Response) => {
    clearOwnerCookie(req, res);
    res.json({ success: true });
  });
}
