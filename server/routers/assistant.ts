import { z } from "zod";
import { getAssistantConfig } from "../db";
import { invokeLLM } from "../_core/llm";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";

const chatMessage = z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(900) });

function localReply(message: string, language: "ar" | "en" | "de") {
  const value = message.toLowerCase();
  if (language === "ar") {
    if (value.includes("كتاب") || value.includes("a1")) return "كتاب German for Nurse A1.1 مناسب كبداية، ويشرح عبارات ومفردات ألمانية عملية للتمريض. يمكنك معاينة العينة ثم الطلب عبر Instagram أو الدفع عبر PayPal.";
    if (value.includes("مستوى") || value.includes("ابدأ")) return "إذا كنت مبتدئًا ابدأ بمسار A1/A2؛ فهو يركز على التعارف والكلمات الأساسية والتواصل داخل القسم.";
    return "أساعدك باختيار المستوى والكتاب والتدرب على عبارات تمريضية بالألمانية. اكتب سؤالك بالتفصيل وسأجيبك.";
  }
  if (language === "de") {
    if (value.includes("buch") || value.includes("a1")) return "German for Nurse A1.1 ist ein praktischer Einstieg mit wichtigen Wörtern und Sätzen für die Pflege. Sie können eine Vorschau ansehen und über Instagram oder PayPal bestellen.";
    if (value.includes("niveau") || value.includes("anfang")) return "Für Anfänger passt A1/A2. Dort lernen Sie Begrüßungen, Vorstellungen und wichtige Wörter für die Station.";
    return "Ich helfe bei Niveau, Buchauswahl und Pflegephrasen. Schreiben Sie Ihre Frage bitte etwas genauer.";
  }
  if (value.includes("book") || value.includes("a1")) return "German for Nurse A1.1 is a practical starting workbook with useful German words and phrases for nursing. Preview it, then order through Instagram or PayPal.";
  if (value.includes("level") || value.includes("beginner")) return "If you are a beginner, start with A1/A2. It covers introductions, essential care words and simple ward communication.";
  return "I can help you choose a level, find a book, or practise a nursing phrase. Please ask a complete question.";
}

export const assistantRouter = router({
  chat: publicProcedure.input(z.object({ messages: z.array(chatMessage).min(1).max(12) })).mutation(async ({ input }) => {
    const config = await getAssistantConfig();
    const instructions = `You are ${config.name}, the friendly navigation and study assistant for medical.sketcher. ${config.scope} Available book sections include A1.1, A1.2, B1.1, B1.2, C1.1, and C1.2, though some can be marked coming soon. Reply in the visitor's language: Arabic, English, or German. Do not claim qualifications, invent course availability, process payments, or give medical advice. Keep responses concise, warm, and practical.`;
    try {
      const lastMessage = input.messages.at(-1)?.content ?? "";
      const language = /[\u0600-\u06ff]/.test(lastMessage) ? "ar" : /[äöüß]/i.test(lastMessage) ? "de" : "en";
      if (!ENV.forgeApiKey) return { response: localReply(lastMessage, language) };
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
