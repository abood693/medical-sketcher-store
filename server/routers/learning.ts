import { z } from "zod";
import { createQuizQuestion, deleteQuizQuestion, listQuizQuestions, saveQuizAttempt, updateQuizQuestion } from "../db";
import { CourseLevel, LearningQuestion, scoreAnswers, starterQuestions } from "../learning.logic";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

const levelSchema = z.enum(["A1/A2", "B1/B2", "C1/C2"]);
const questionInput = z.object({
  level: levelSchema,
  prompt: z.string().min(4).max(800),
  choices: z.array(z.string().min(1).max(240)).length(4),
  correctIndex: z.number().int().min(0).max(3),
});

async function availableQuestions(level: CourseLevel): Promise<LearningQuestion[]> {
  const stored = await listQuizQuestions(level);
  if (stored.length === 0) return starterQuestions[level];
  return stored.map(question => ({
    id: question.id,
    level: question.level,
    prompt: question.prompt,
    choices: question.choices,
    correctIndex: question.correctIndex,
  }));
}

export const learningRouter = router({
  questions: router({
    list: publicProcedure.input(z.object({ level: levelSchema })).query(({ input }) => availableQuestions(input.level)),
    submit: protectedProcedure.input(z.object({ level: levelSchema, answers: z.array(z.number().int().min(0).max(3)).max(40) })).mutation(async ({ input, ctx }) => {
      const questions = await availableQuestions(input.level);
      const score = scoreAnswers(questions, input.answers);
      await saveQuizAttempt({ userId: ctx.user.id, level: input.level, score, total: questions.length });
      return { score, total: questions.length, passed: score / Math.max(questions.length, 1) >= 0.7 };
    }),
  }),
  admin: router({
    createQuestion: adminProcedure.input(questionInput).mutation(async ({ input }) => ({ id: await createQuizQuestion(input) })),
    updateQuestion: adminProcedure.input(questionInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const { id, ...values } = input;
      await updateQuizQuestion(id, values);
      return { success: true };
    }),
    deleteQuestion: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteQuizQuestion(input.id);
      return { success: true };
    }),
  }),
});
