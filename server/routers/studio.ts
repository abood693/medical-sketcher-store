import { z } from "zod";
import { getAssistantConfig, listContentShelves, saveAssistantConfig, saveContentShelf } from "../db";
import { DEFAULT_ASSISTANT_CONFIG, SHELF_DEFAULTS, type ShelfId } from "../studio.defaults";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const shelfIds = SHELF_DEFAULTS.map(item => item.id) as [string, ...string[]];
const shelfStatuses = ["coming_soon", "published", "hidden"] as const;

export const studioRouter = router({
  shelves: router({
    list: publicProcedure.query(async () => listContentShelves()),
    update: adminProcedure.input(z.object({
      id: z.enum(shelfIds),
      title: z.string().min(2).max(80),
      status: z.enum(shelfStatuses),
      note: z.string().min(4).max(500),
    })).mutation(async ({ input }) => {
      await saveContentShelf({ ...input, id: input.id as ShelfId });
      return { success: true };
    }),
  }),
  assistant: router({
    get: adminProcedure.query(async () => getAssistantConfig()),
    profile: publicProcedure.query(async () => getAssistantConfig()),
    update: adminProcedure.input(z.object({
      name: z.string().min(2).max(40),
      greeting: z.string().min(8).max(300),
      scope: z.string().min(12).max(700),
    })).mutation(async ({ input }) => {
      await saveAssistantConfig(input);
      return { success: true };
    }),
    defaults: publicProcedure.query(() => DEFAULT_ASSISTANT_CONFIG),
  }),
});
