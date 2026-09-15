import { and, desc, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import {
  assistantSettings,
  contentShelves,
  digitalOrders,
  digitalProducts,
  DigitalProduct,
  InsertLessonFeedback,
  InsertQuizQuestion,
  InsertUser,
  lessonFeedback,
  productLicenses,
  quizAttempts,
  quizQuestions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import {
  DEFAULT_ASSISTANT_CONFIG,
  SHELF_DEFAULTS,
  ShelfId,
  ShelfStatus,
} from "./studio.defaults";
import { initialUserRole, shouldUpdateExistingRole } from "./user-role.logic";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field];
      updateSet[field] = user[field];
    }
  }
  const isConfiguredOwner = user.openId === ENV.ownerOpenId;
  values.role = initialUserRole(user.role, isConfiguredOwner);
  if (shouldUpdateExistingRole(user.role, isConfiguredOwner)) {
    updateSet.role = values.role;
  }
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function listQuizQuestions(level: "A1/A2" | "B1/B2" | "C1/C2") {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.level, level))
    .orderBy(desc(quizQuestions.id));
}

export async function createQuizQuestion(
  input: Omit<InsertQuizQuestion, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(quizQuestions).values(input);
  return Number(result[0].insertId);
}

export async function updateQuizQuestion(
  id: number,
  input: Partial<Omit<InsertQuizQuestion, "id" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(quizQuestions).set(input).where(eq(quizQuestions.id, id));
}

export async function deleteQuizQuestion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(quizQuestions).where(eq(quizQuestions.id, id));
}

export async function saveQuizAttempt(input: {
  userId?: number;
  level: "A1/A2" | "B1/B2" | "C1/C2";
  score: number;
  total: number;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(quizAttempts).values(input);
}

export async function listContentShelves() {
  const db = await getDb();
  if (!db) return SHELF_DEFAULTS;
  const rows = await db.select().from(contentShelves);
  if (rows.length === 0) return SHELF_DEFAULTS;
  const known = new Map(rows.map(row => [row.id, row]));
  return SHELF_DEFAULTS.map(item => {
    const stored = known.get(item.id);
    return stored
      ? {
          id: item.id,
          title: stored.title,
          status: stored.status,
          note: stored.note,
        }
      : item;
  });
}

export async function saveContentShelf(input: {
  id: ShelfId;
  title: string;
  status: ShelfStatus;
  note: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db
    .insert(contentShelves)
    .values(input)
    .onDuplicateKeyUpdate({
      set: { title: input.title, status: input.status, note: input.note },
    });
}

export async function listApprovedLessonFeedback(lessonKey: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(lessonFeedback)
    .where(
      and(
        eq(lessonFeedback.lessonKey, lessonKey),
        eq(lessonFeedback.status, "approved")
      )
    )
    .orderBy(desc(lessonFeedback.createdAt));
}

export async function listAllLessonFeedback() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(lessonFeedback)
    .orderBy(desc(lessonFeedback.createdAt));
}

export async function createLessonFeedback(
  input: Omit<InsertLessonFeedback, "id" | "createdAt" | "updatedAt" | "status">
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db
    .insert(lessonFeedback)
    .values({ ...input, status: "pending" });
  return Number(result[0].insertId);
}

export async function updateLessonFeedbackStatus(
  id: number,
  status: "pending" | "approved" | "rejected"
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db
    .update(lessonFeedback)
    .set({ status })
    .where(eq(lessonFeedback.id, id));
}

export async function getAssistantConfig() {
  const db = await getDb();
  if (!db) return DEFAULT_ASSISTANT_CONFIG;
  const rows = await db
    .select()
    .from(assistantSettings)
    .where(eq(assistantSettings.key, "primary"))
    .limit(1);
  return rows[0]?.value ?? DEFAULT_ASSISTANT_CONFIG;
}

export async function saveAssistantConfig(
  input: typeof DEFAULT_ASSISTANT_CONFIG
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db
    .insert(assistantSettings)
    .values({ key: "primary", value: input })
    .onDuplicateKeyUpdate({
      set: { value: input },
    });
}

export async function listPublishedProducts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(digitalProducts)
    .where(eq(digitalProducts.status, "published"))
    .orderBy(desc(digitalProducts.createdAt));
}

export async function listAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(digitalProducts)
    .orderBy(desc(digitalProducts.createdAt));
}

export async function getDigitalProduct(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return (
    await db
      .select()
      .from(digitalProducts)
      .where(eq(digitalProducts.id, id))
      .limit(1)
  )[0];
}

export async function createDigitalProduct(
  input: Omit<DigitalProduct, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(digitalProducts).values(input);
  return Number(result[0].insertId);
}

export async function updateDigitalProduct(
  id: number,
  input: Partial<
    Pick<
      DigitalProduct,
      | "title"
      | "description"
      | "priceCents"
      | "currency"
      | "coverUrl"
      | "status"
    >
  >
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db
    .update(digitalProducts)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(digitalProducts.id, id));
}

export async function removeDigitalProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  // Keep the row for historical orders/licenses, but remove it from sale.
  await db
    .update(digitalProducts)
    .set({ status: "hidden", updatedAt: new Date() })
    .where(eq(digitalProducts.id, id));
}

export async function createDigitalOrder(input: {
  productId: number;
  userId: number;
  paypalOrderId: string;
  amountCents: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db
    .insert(digitalOrders)
    .values({ ...input, status: "created" });
  return Number(result[0].insertId);
}

export async function completeDigitalOrder(
  paypalOrderId: string,
  userId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const order = (
    await db
      .select()
      .from(digitalOrders)
      .where(
        and(
          eq(digitalOrders.paypalOrderId, paypalOrderId),
          eq(digitalOrders.userId, userId)
        )
      )
      .limit(1)
  )[0];
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid")
    await db
      .update(digitalOrders)
      .set({ status: "paid", paidAt: new Date() })
      .where(eq(digitalOrders.id, order.id));
  const existing = (
    await db
      .select()
      .from(productLicenses)
      .where(eq(productLicenses.orderId, order.id))
      .limit(1)
  )[0];
  if (existing) return existing;
  const licenseHash = crypto
    .createHash("sha256")
    .update(
      `${order.id}:${order.userId}:${order.productId}:${crypto.randomUUID()}`
    )
    .digest("hex");
  await db
    .insert(productLicenses)
    .values({
      productId: order.productId,
      orderId: order.id,
      userId: order.userId,
      licenseHash,
    });
  return (
    await db
      .select()
      .from(productLicenses)
      .where(eq(productLicenses.orderId, order.id))
      .limit(1)
  )[0];
}

export async function getOwnedProduct(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  return (
    await db
      .select({ product: digitalProducts, license: productLicenses })
      .from(productLicenses)
      .innerJoin(
        digitalProducts,
        eq(productLicenses.productId, digitalProducts.id)
      )
      .where(
        and(
          eq(productLicenses.userId, userId),
          eq(productLicenses.productId, productId)
        )
      )
      .limit(1)
  )[0];
}

export async function listOwnedProducts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ product: digitalProducts, license: productLicenses })
    .from(productLicenses)
    .innerJoin(digitalProducts, eq(productLicenses.productId, digitalProducts.id))
    .where(eq(productLicenses.userId, userId))
    .orderBy(desc(productLicenses.createdAt));
}
