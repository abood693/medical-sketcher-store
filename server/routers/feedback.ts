import { z } from "zod";
import { createLessonFeedback, listAllLessonFeedback, listApprovedLessonFeedback, updateLessonFeedbackStatus } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { feedbackLessonKeyPattern } from "../feedback.logic";

const lessonKey = z.string().min(2).max(80).regex(feedbackLessonKeyPattern);

export const feedbackRouter = router({
  list: publicProcedure.input(z.object({ lessonKey })).query(({ input }) => listApprovedLessonFeedback(input.lessonKey)),
  submit: publicProcedure.input(z.object({
    lessonKey,
    authorName: z.string().trim().min(2).max(100),
    rating: z.number().int().min(1).max(5),
    body: z.string().trim().min(4).max(1000),
  })).mutation(async ({ input, ctx }) => {
    const id = await createLessonFeedback({ ...input, userId: ctx.user?.id });
    return { success: true, id, status: "pending" as const };
  }),
  admin: router({
    list: adminProcedure.query(() => listAllLessonFeedback()),
    setStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "approved", "rejected"]) })).mutation(async ({ input }) => {
      await updateLessonFeedbackStatus(input.id, input.status);
      return { success: true };
    }),
  }),
});
