import express, { type Express, type Request, type Response } from "express";
import { sdk } from "./sdk";
import { storagePut } from "../storage";

const MAX_PDF_BYTES = 500 * 1024 * 1024;

function safeFileName(value: string) {
  const normalized = value.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized.toLowerCase().endsWith(".pdf") ? normalized : `${normalized}.pdf`;
}

/**
 * Upload a PDF as a binary request instead of embedding it in JSON/Base64.
 * This avoids the 33% Base64 overhead and the request-size failures that made
 * the UI report "PDF required" even though a file had been selected.
 */
export function registerDigitalProductUploadRoute(app: Express) {
  app.post(
    "/api/admin/digital-products/upload-pdf",
    express.raw({
      type: ["application/pdf", "application/octet-stream"],
      limit: "500mb",
    }),
    async (req: Request, res: Response) => {
      try {
        const user = await sdk.authenticateRequest(req);
        if (user.role !== "admin") {
          res.status(403).json({ error: "Owner access required" });
          return;
        }

        const data = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
        if (data.length === 0) {
          res.status(400).json({ error: "PDF file is required" });
          return;
        }
        if (data.length > MAX_PDF_BYTES) {
          res.status(413).json({ error: "PDF files must be smaller than 500 MB" });
          return;
        }
        if (data.subarray(0, 4).toString() !== "%PDF") {
          res.status(400).json({ error: "Only valid PDF files are allowed" });
          return;
        }

        const fileName = safeFileName(
          typeof req.headers["x-file-name"] === "string"
            ? req.headers["x-file-name"]
            : "book.pdf"
        );
        const result = await storagePut(
          `products/${crypto.randomUUID()}-${fileName}`,
          data,
          "application/pdf"
        );
        res.json(result);
      } catch (error) {
        console.error("[DigitalProductUpload] Upload failed:", error);
        const message = error instanceof Error ? error.message : "Upload failed";
        const status = message.includes("Invalid session") ? 401 : 500;
        res.status(status).json({ error: message });
      }
    }
  );
}

export { MAX_PDF_BYTES };
