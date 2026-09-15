import crypto from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import express, { type Express, type Request, type Response } from "express";
import { sdk } from "./sdk";
import { storagePutStream } from "../storage";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;
const CHUNK_LIMIT = 16 * 1024 * 1024;
const UPLOAD_DIR = "/tmp/medical-sketcher-uploads";
const uploads = new Map<string, { filePath: string; received: number; total: number }>();

function safeFileName(value: string) {
  const normalized = value.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized.toLowerCase().endsWith(".pdf") ? normalized : `${normalized}.pdf`;
}

async function requireAdmin(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.role !== "admin") {
      res.status(403).json({ error: "Owner access required" });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: "Invalid session cookie" });
    return false;
  }
}

function parseRange(value: string | undefined) {
  const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(value ?? "");
  if (!match) return null;
  return { start: Number(match[1]), end: Number(match[2]), total: Number(match[3]) };
}

/**
 * Chunked PDF upload: only one bounded chunk is held in memory at a time.
 * The completed temporary file is streamed into object storage.
 */
export function registerDigitalProductUploadRoute(app: Express) {
  app.post("/api/admin/digital-products/upload-pdf/start", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    const total = Number(req.headers["x-upload-size"]);
    if (!Number.isSafeInteger(total) || total <= 0 || total > MAX_UPLOAD_BYTES) {
      res.status(413).json({ error: "PDF files must be smaller than 2 GB" });
      return;
    }
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const id = crypto.randomUUID();
    const filePath = path.join(UPLOAD_DIR, id);
    await fs.writeFile(filePath, Buffer.alloc(0), { flag: "wx" });
    uploads.set(id, { filePath, received: 0, total });
    res.json({ uploadId: id, chunkSize: 8 * 1024 * 1024 });
  });

  app.patch(
    "/api/admin/digital-products/upload-pdf/:uploadId",
    express.raw({ type: ["application/octet-stream", "application/pdf"], limit: CHUNK_LIMIT }),
    async (req, res) => {
      if (!(await requireAdmin(req, res))) return;
      const upload = uploads.get(req.params.uploadId);
      const range = parseRange(req.headers["content-range"]);
      const data = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
      if (!upload || !range || range.total !== upload.total || range.start !== upload.received || range.end !== range.start + data.length - 1) {
        res.status(409).json({ error: "Invalid upload chunk or upload session" });
        return;
      }
      if (data.length === 0 || data.length > CHUNK_LIMIT || upload.received + data.length > upload.total) {
        res.status(413).json({ error: "Invalid chunk size" });
        return;
      }
      await fs.appendFile(upload.filePath, data);
      upload.received += data.length;
      res.json({ received: upload.received, total: upload.total });
    }
  );

  app.post("/api/admin/digital-products/upload-pdf/:uploadId/complete", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    const upload = uploads.get(req.params.uploadId);
    if (!upload || upload.received !== upload.total) {
      res.status(409).json({ error: "Upload is incomplete" });
      return;
    }
    const fileName = safeFileName(String(req.headers["x-file-name"] ?? "book.pdf"));
    try {
      const header = Buffer.alloc(4);
      const handle = await fs.open(upload.filePath, "r");
      await handle.read(header, 0, 4, 0);
      await handle.close();
      if (header.toString() !== "%PDF") {
        res.status(400).json({ error: "Only valid PDF files are allowed" });
        return;
      }
      const result = await storagePutStream(
        `products/${crypto.randomUUID()}-${fileName}`,
        createReadStream(upload.filePath),
        "application/pdf"
      );
      res.json(result);
    } catch (error) {
      console.error("[DigitalProductUpload] Complete failed:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      uploads.delete(req.params.uploadId);
      await fs.rm(upload.filePath, { force: true }).catch(() => undefined);
    }
  });
}

export { MAX_UPLOAD_BYTES };
