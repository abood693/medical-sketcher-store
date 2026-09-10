import { z } from "zod";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createPaypalOrder, capturePaypalOrder } from "../_core/paypal";
import { completeDigitalOrder, createDigitalOrder, createDigitalProduct, getDigitalProduct, getOwnedProduct, listAllProducts, listPublishedProducts } from "../db";
import { storageGetSignedUrl, storagePut } from "../storage";

export const digitalProductsRouter = router({
  list: publicProcedure.query(() => listPublishedProducts()),
  adminList: adminProcedure.query(() => listAllProducts()),
  adminCreate: adminProcedure.input(z.object({ title: z.string().min(1).max(180), description: z.string().min(1), priceCents: z.number().int().positive(), currency: z.string().length(3).default("USD"), coverUrl: z.string().url().optional(), pdfKey: z.string().min(1).max(512), status: z.enum(["draft", "published", "hidden"]).default("draft") })).mutation(({ input, ctx }) => createDigitalProduct({ ...input, coverUrl: input.coverUrl ?? null, createdBy: ctx.user.id })),
  adminUploadPdf: adminProcedure.input(z.object({ fileName: z.string().min(1).max(120), base64: z.string().min(1).max(15000000) })).mutation(async ({ input }) => {
    const data = Buffer.from(input.base64.replace(/^data:application\/pdf;base64,/, ""), "base64");
    if (data.subarray(0, 4).toString() !== "%PDF") throw new Error("Only valid PDF files are allowed");
    return storagePut(`products/${crypto.randomUUID()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`, data, "application/pdf");
  }),
  createOrder: protectedProcedure.input(z.object({ productId: z.number().int().positive() })).mutation(async ({ input, ctx }) => {
    const product = await getDigitalProduct(input.productId);
    if (!product || product.status !== "published") throw new Error("Product is unavailable");
    const paypal = await createPaypalOrder({ orderReference: `product-${product.id}`, amountCents: product.priceCents, currency: product.currency });
    await createDigitalOrder({ productId: product.id, userId: ctx.user.id, paypalOrderId: paypal.id, amountCents: product.priceCents });
    return { paypalOrderId: paypal.id, approvalUrl: paypal.links?.find(link => link.rel === "approve")?.href ?? null };
  }),
  captureOrder: protectedProcedure.input(z.object({ paypalOrderId: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    const paypal = await capturePaypalOrder(input.paypalOrderId);
    if (paypal.status !== "COMPLETED") throw new Error("Payment was not completed");
    const license = await completeDigitalOrder(input.paypalOrderId, ctx.user.id);
    return { success: true, licenseHash: license?.licenseHash };
  }),
  download: protectedProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ input, ctx }) => {
    const owned = await getOwnedProduct(ctx.user.id, input.productId);
    if (!owned) throw new Error("You do not own this product");
    return { url: await storageGetSignedUrl(owned.product.pdfKey), licenseHash: owned.license.licenseHash };
  }),
});
