import { z } from "zod";
import { getAssistantConfig } from "../db";
import { invokeLLM } from "../_core/llm";
import { publicProcedure, router } from "../_core/trpc";

const chatMessage = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(900) });

export const assistantRouter = router({
  chat: publicProcedure.input(z.object({ messages: z.array(chatMessage).min(1).max(12) })).mutation(async ({ input }) => {
    const config = await getAssistantConfig();
    const instructions = `You are ${config.name}, the friendly navigation and study assistant for medical.sketcher. ${config.scope} Available book sections include A1.1, A1.2, B1.1, B1.2, C1.1, and C1.2, though some can be marked coming soon. Reply in the visitor's language: Arabic, English, or German. Do not claim qualifications, invent course availability, process payments, or give medical advice. Keep responses concise, warm, and practical.`;
    try {
      const response = await invokeLLM({
        maxTokens: 360,
        messages: [{ role: "system", content: instructions }, ...input.messages],
      });
      const content = response.choices[0]?.message.content;
      return { response: typeof content === "string" ? content : "How can I help you continue your learning?" };
    } catch (error) {
      console.error("[abdelrazaq] Assistant request failed", error);
      return { response: "I’m here to help you explore the books, levels, and quizzes. Please try again in a moment." };
    }
  }),
});
