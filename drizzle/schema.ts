import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const courseLevels = mysqlEnum("courseLevel", ["A1/A2", "B1/B2", "C1/C2"]);
export const contentStatus = mysqlEnum("contentStatus", ["coming_soon", "published", "hidden"]);
export const feedbackStatus = mysqlEnum("feedbackStatus", ["pending", "approved", "rejected"]);
export const productStatus = mysqlEnum("productStatus", ["draft", "published", "hidden"]);
export const orderStatus = mysqlEnum("orderStatus", ["created", "paid", "cancelled"]);

export const quizQuestions = mysqlTable("quizQuestions", {
  id: int("id").autoincrement().primaryKey(),
  level: courseLevels.notNull(),
  prompt: text("prompt").notNull(),
  choices: json("choices").$type<string[]>().notNull(),
  correctIndex: int("correctIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  level: courseLevels.notNull(),
  score: int("score").notNull(),
  total: int("total").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export const contentShelves = mysqlTable("contentShelves", {
  id: varchar("id", { length: 16 }).primaryKey(),
  title: varchar("title", { length: 80 }).notNull(),
  status: contentStatus.default("coming_soon").notNull(),
  note: text("note").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const lessonFeedback = mysqlTable("lessonFeedback", {
  id: int("id").autoincrement().primaryKey(),
  lessonKey: varchar("lessonKey", { length: 80 }).notNull(),
  userId: int("userId"),
  authorName: varchar("authorName", { length: 100 }).notNull(),
  rating: int("rating").notNull(),
  body: text("body").notNull(),
  status: feedbackStatus.default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const assistantSettings = mysqlTable("assistantSettings", {
  key: varchar("key", { length: 32 }).primaryKey(),
  value: json("value").$type<{ name: string; greeting: string; scope: string }>().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Paid digital products. PDF keys are private storage keys, never public URLs. */
export const digitalProducts = mysqlTable("digitalProducts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  priceCents: int("priceCents").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  coverUrl: text("coverUrl"),
  pdfKey: varchar("pdfKey", { length: 512 }).notNull(),
  status: productStatus.default("draft").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const digitalOrders = mysqlTable("digitalOrders", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  paypalOrderId: varchar("paypalOrderId", { length: 80 }).notNull().unique(),
  status: orderStatus.default("created").notNull(),
  amountCents: int("amountCents").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
});

export const productLicenses = mysqlTable("productLicenses", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  orderId: int("orderId").notNull().unique(),
  userId: int("userId").notNull(),
  licenseHash: varchar("licenseHash", { length: 128 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
export type ContentShelf = typeof contentShelves.$inferSelect;
export type LessonFeedback = typeof lessonFeedback.$inferSelect;
export type InsertLessonFeedback = typeof lessonFeedback.$inferInsert;
export type DigitalProduct = typeof digitalProducts.$inferSelect;
export type DigitalOrder = typeof digitalOrders.$inferSelect;
export type ProductLicense = typeof productLicenses.$inferSelect;
