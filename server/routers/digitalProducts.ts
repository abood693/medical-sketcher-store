import { z } from "zod";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../_core/trpc";
import { createPaypalOrder, capturePaypalOrder } from "../_core/paypal";
import {
  completeDigitalOrder,
  createDigitalOrder,
  createDigitalProduct,
  getDigitalProduct,
  getOwnedProduct,
  listAllProducts,
  listOwnedProducts,
  listPublishedProducts,
  removeDigitalProduct,
  updateDigitalProduct,
} from "../db";
import { storageGetSignedUrl, storagePut } from "../storage";

export const digitalProductsRouter = router({
  list: publicProcedure.query(() => listPublishedProducts()),
  demoCheckout: publicProcedure.mutation(async () => {
    // PayPal Checkout does not support JOD. The storefront price remains 5 JOD;
    // Sandbox checkout uses a clearly-labelled USD equivalent for testing.
    const paypal = await createPaypalOrder({
      orderReference: "german-for-nurse-a1-1",
      amountCents: 700,
      currency: "USD",
    });
    return {
      approvalUrl:
        paypal.links?.find(link => link.rel === "approve")?.href ?? null,
    };
  }),
  adminList: adminProcedure.query(() => listAllProducts()),
  myLibrary: protectedProcedure.query(async ({ ctx }) =>
    Promise.all(
      (await listOwnedProducts(ctx.user.id)).map(async item => ({
        title: item.product.title,
        productId: item.product.id,
        purchasedAt: item.license.createdAt,
        downloadUrl: await storageGetSignedUrl(item.product.pdfKey),
      }))
    )
  ),
  adminCreate: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(180),
        description: z.string().min(1),
        priceCents: z.number().int().positive(),
        currency: z.string().length(3).default("JOD"),
        coverUrl: z.string().url().optional(),
        pdfKey: z.string().min(1).max(512),
        status: z.enum(["draft", "published", "hidden"]).default("draft"),
      })
    )
    .mutation(({ input, ctx }) =>
      createDigitalProduct({
        ...input,
        coverUrl: input.coverUrl ?? null,
        createdBy: ctx.user.id,
      })
    ),
  adminUpdate: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(180),
        description: z.string().min(1),
        priceCents: z.number().int().positive(),
        currency: z.string().length(3),
        coverUrl: z.string().url().optional().or(z.literal("")),
        status: z.enum(["draft", "published", "hidden"]),
      })
    )
    .mutation(({ input }) =>
      updateDigitalProduct(input.id, {
        title: input.title,
        description: input.description,
        priceCents: input.priceCents,
        currency: input.currency,
        coverUrl: input.coverUrl || null,
        status: input.status,
      })
    ),
  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(({ input }) => removeDigitalProduct(input.id)),
  adminUploadPdf: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(120),
        // Kept for backwards compatibility; the UI uses the binary endpoint.
        base64: z.string().min(1).max(700000000),
      })
    )
    .mutation(async ({ input }) => {
      const data = Buffer.from(
        input.base64.replace(/^data:application\/pdf;base64,/, ""),
        "base64"
      );
      if (data.length > 500 * 1024 * 1024)
        throw new Error("PDF files must be smaller than 500 MB");
      if (data.subarray(0, 4).toString() !== "%PDF")
        throw new Error("Only valid PDF files are allowed");
      return storagePut(
        `products/${crypto.randomUUID()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        data,
        "application/pdf"
      );
    }),
  createOrder: protectedProcedure
    .input(z.object({ productId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const product = await getDigitalProduct(input.productId);
      if (!product || product.status !== "published")
        throw new Error("Product is unavailable");
      const paypal = await createPaypalOrder({
        orderReference: `product-${product.id}`,
        amountCents: product.priceCents,
        currency: product.currency,
      });
      await createDigitalOrder({
        productId: product.id,
        userId: ctx.user.id,
        paypalOrderId: paypal.id,
        amountCents: product.priceCents,
      });
      return {
        paypalOrderId: paypal.id,
        approvalUrl:
          paypal.links?.find(link => link.rel === "approve")?.href ?? null,
      };
    }),
  captureOrder: protectedProcedure
    .input(z.object({ paypalOrderId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const paypal = await capturePaypalOrder(input.paypalOrderId);
      if (paypal.status !== "COMPLETED")
        throw new Error("Payment was not completed");
      const license = await completeDigitalOrder(
        input.paypalOrderId,
        ctx.user.id
      );
      return { success: true, licenseHash: license?.licenseHash };
    }),
  download: protectedProcedure
    .input(z.object({ productId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const owned = await getOwnedProduct(ctx.user.id, input.productId);
      if (!owned) throw new Error("You do not own this product");
      return {
        url: await storageGetSignedUrl(owned.product.pdfKey),
        licenseHash: owned.license.licenseHash,
      };
    }),
});
