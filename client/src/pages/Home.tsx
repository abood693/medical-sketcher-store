import { AIChatBox } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  HeartPulse,
  Instagram,
  Languages,
  Menu,
  MessageCircle,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { toast } from "sonner";

type Locale = "ar" | "en" | "de";
type Level = "A1/A2" | "B1/B2" | "C1/C2";
type Shelf = "A1.1" | "A1.2" | "B1.1" | "B1.2" | "C1.1" | "C1.2";

type Copy = {
  books: string;
  tests: string;
  method: string;
  owner: string;
  heroTag: string;
  hero: string;
  intro: string;
  explore: string;
  check: string;
  pathway: string;
  pathwayText: string;
  library: string;
  libraryText: string;
  testTitle: string;
  testText: string;
  start: string;
  result: string;
  score: string;
  retry: string;
  book: string;
  empty: string;
  assistant: string;
  assistantIntro: string;
  secure: string;
  learnLine: string;
  share: string;
  preview: string;
  reviews: string;
  reviewsEmpty: string;
  available: string;
  availableNote: string;
  flagshipEyebrow: string;
  flagshipTitle: string;
  flagshipText: string;
  orderGuide: string;
  sampleNote: string;
  orderTitle: string;
  orderText: string;
  stepOne: string;
  stepOneText: string;
  stepTwo: string;
  stepTwoText: string;
  stepThree: string;
  stepThreeText: string;
  faqTitle: string;
  faqOne: string;
  faqOneText: string;
  faqTwo: string;
  faqTwoText: string;
  faqThree: string;
  faqThreeText: string;
  feedbackTitle: string;
  feedbackText: string;
  feedbackNote: string;
  shareNotice: string;
  shareFallback: string;
  chatTitle: string;
  chatText: string;
  heroImageAlt: string;
};

const text: Record<Locale, Copy> = {
  en: {
    books: "Books",
    tests: "Level tests",
    method: "Learning method",
    owner: "Owner studio",
    heroTag: "GERMAN FOR NURSING",
    hero: "German that works on the ward.",
    intro:
      "A visual learning system for nurses who want clearer conversations, calmer shifts and a confident first step into German healthcare.",
    explore: "Explore the pathway",
    check: "Find my level",
    pathway: "Your next shift starts here.",
    pathwayText:
      "Build practical German in three calm stages â€” from first introductions to precise clinical communication.",
    library: "The professional library.",
    libraryText:
      "One focused workbook at a time, built around the language nurses actually use.",
    testTitle: "Know your next step.",
    testText:
      "The A1.1 assessment follows the workbook lessons and gives you an instant practice result.",
    start: "Start assessment",
    result: "See my result",
    score: "Your score",
    retry: "Try again",
    book: "Order on Instagram",
    empty: "Coming soon",
    assistant: "Ask abdelrazaq",
    assistantIntro:
      "Hello, Iâ€™m abdelrazaq. I can help you choose a level, find a book or practise a nursing phrase.",
    secure: "Learn with clarity",
    learnLine: "LEARN Â· PRACTICE Â· CARE",
    share: "Share book",
    preview: "View free sample",
    reviews: "Student feedback",
    reviewsEmpty: "Verified student feedback will appear here.",
    available: "Available now",
    availableNote: "Cover, free sample and direct ordering are ready.",
    flagshipEyebrow: "THE FIRST WORKBOOK",
    flagshipTitle: "German for Nurse A1.1",
    flagshipText:
      "A practical first step for nurses learning essential German communication in healthcare â€” with visual lessons, useful vocabulary and structured practice.",
    orderGuide: "5 JD Â· direct Instagram order",
    sampleNote: "Preview four pages before you decide.",
    orderTitle: "A simple path to your copy.",
    orderText:
      "No complicated checkout. Choose the book, preview it, then send a direct message to @medical.sketcher.",
    stepOne: "Preview",
    stepOneText: "See four real sample pages and understand the visual rhythm.",
    stepTwo: "Message",
    stepTwoText: "Open Instagram Direct with a ready-to-send product request.",
    stepThree: "Receive",
    stepThreeText: "Confirm payment and delivery details in the conversation.",
    faqTitle: "Questions, answered.",
    faqOne: "Is A1.1 suitable for beginners?",
    faqOneText:
      "Yes. It starts with introductions and builds toward everyday nursing communication.",
    faqTwo: "What do I receive?",
    faqTwoText:
      "The book details and delivery method are confirmed with you in the Instagram conversation before payment.",
    faqThree: "Are the assessments certificates?",
    faqThreeText:
      "No. They are practice assessments designed to help you check your progress.",
    feedbackTitle: "Your progress deserves a real voice.",
    feedbackText:
      "When learners complete a book, we will invite them to share honest feedback. Until then, this space stays intentionally quiet.",
    feedbackNote: "Only approved, verified student feedback will be published.",
    shareNotice: "Share sheet opened",
    shareFallback: "Message copied â€” Instagram opened",
    chatTitle: "Study with abdelrazaq",
    chatText:
      "Ask about your level, the workbook or a German phrase for your next shift.",
    heroImageAlt: "Illustrated nurse learning German",
  },
  de: {
    books: "BÃ¼cher",
    tests: "Einstufungstests",
    method: "Lernmethode",
    owner: "Besitzer-Studio",
    heroTag: "DEUTSCH FÃœR DIE PFLEGE",
    hero: "Deutsch, das auf der Station hilft.",
    intro:
      "Ein visuelles Lernsystem fÃ¼r PflegekrÃ¤fte, die klarer kommunizieren, ruhiger arbeiten und sicher in die deutsche Pflege starten mÃ¶chten.",
    explore: "Lernweg entdecken",
    check: "Mein Niveau finden",
    pathway: "Deine nÃ¤chste Schicht beginnt hier.",
    pathwayText:
      "Baue praktisches Deutsch in drei ruhigen Stufen auf â€” von der ersten Vorstellung bis zur prÃ¤zisen klinischen Kommunikation.",
    library: "Die Fachbibliothek.",
    libraryText:
      "Ein fokussiertes Arbeitsbuch nach dem anderen, mit der Sprache aus dem Pflegealltag.",
    testTitle: "Kenne deinen nÃ¤chsten Schritt.",
    testText:
      "Der A1.1-Test folgt den Lektionen und zeigt dir sofort dein Ãœbungsergebnis.",
    start: "Test starten",
    result: "Ergebnis sehen",
    score: "Dein Ergebnis",
    retry: "Noch einmal",
    book: "Auf Instagram bestellen",
    empty: "DemnÃ¤chst verfÃ¼gbar",
    assistant: "abdelrazaq fragen",
    assistantIntro:
      "Hallo, ich bin abdelrazaq. Ich helfe dir bei Niveau, Buchauswahl oder einer Pflegephrase.",
    secure: "Klar lernen",
    learnLine: "LERNEN Â· ÃœBEN Â· PFLEGEN",
    share: "Buch teilen",
    preview: "Kostenlose Leseprobe",
    reviews: "Stimmen der Lernenden",
    reviewsEmpty: "Verifizierte RÃ¼ckmeldungen erscheinen hier.",
    available: "Jetzt verfÃ¼gbar",
    availableNote: "Cover, Leseprobe und direkte Bestellung sind bereit.",
    flagshipEyebrow: "DAS ERSTE ARBEITSBUCH",
    flagshipTitle: "German for Nurse A1.1",
    flagshipText:
      "Ein praktischer Einstieg fÃ¼r PflegekrÃ¤fte in die wichtige Kommunikation im Gesundheitswesen â€” mit visuellen Lektionen, nÃ¼tzlichen WÃ¶rtern und strukturiertem Ãœben.",
    orderGuide: "5 JD Â· direkte Instagram-Bestellung",
    sampleNote: "Sieh dir vier Seiten an, bevor du dich entscheidest.",
    orderTitle: "Ein einfacher Weg zu deinem Exemplar.",
    orderText:
      "Kein komplizierter Checkout. WÃ¤hle das Buch, sieh die Leseprobe und schreibe @medical.sketcher direkt.",
    stepOne: "Vorschau",
    stepOneText: "Sieh vier echte Probeseiten und den visuellen Lernrhythmus.",
    stepTwo: "Nachricht",
    stepTwoText: "Ã–ffne Instagram Direct mit einer fertigen Buchanfrage.",
    stepThree: "Erhalten",
    stepThreeText: "BestÃ¤tige Zahlung und Lieferung im GesprÃ¤ch.",
    faqTitle: "Fragen? Hier sind Antworten.",
    faqOne: "Ist A1.1 fÃ¼r AnfÃ¤nger geeignet?",
    faqOneText:
      "Ja. Das Buch beginnt mit Vorstellen und fÃ¼hrt in die alltÃ¤gliche Pflegekommunikation.",
    faqTwo: "Was erhalte ich?",
    faqTwoText:
      "Buchdetails und Lieferart werden vor der Zahlung im Instagram-GesprÃ¤ch bestÃ¤tigt.",
    faqThree: "Sind die Tests Zertifikate?",
    faqThreeText:
      "Nein. Sie sind Ãœbungstests zur Kontrolle deines Lernfortschritts.",
    feedbackTitle: "Dein Fortschritt verdient eine echte Stimme.",
    feedbackText:
      "Nach dem Buch laden wir Lernende zu ehrlichem Feedback ein. Bis dahin bleibt dieser Bereich bewusst leer.",
    feedbackNote:
      "Nur geprÃ¼fte und freigegebene RÃ¼ckmeldungen werden verÃ¶ffentlicht.",
    shareNotice: "Teilen geÃ¶ffnet",
    shareFallback: "Nachricht kopiert â€” Instagram geÃ¶ffnet",
    chatTitle: "Lerne mit abdelrazaq",
    chatText:
      "Frage nach Niveau, Arbeitsbuch oder einer Pflegephrase fÃ¼r deine nÃ¤chste Schicht.",
    heroImageAlt: "Illustration einer lernenden Pflegekraft",
  },
  ar: {
    books: "Ø§Ù„ÙƒØªØ¨",
    tests: "Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„Ù…Ø³ØªÙˆÙ‰",
    method: "Ù…Ù†Ù‡Ø¬ Ø§Ù„ØªØ¹Ù„Ù…",
    owner: "Ø§Ø³ØªÙˆØ¯ÙŠÙˆ Ø§Ù„Ù…Ø§Ù„Ùƒ",
    heroTag: "Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ© Ù„Ù„ØªÙ…Ø±ÙŠØ¶",
    hero: "Ø£Ù„Ù…Ø§Ù†ÙŠØ© ØªØ³Ø§Ø¹Ø¯Ùƒ Ø¯Ø§Ø®Ù„ Ø§Ù„Ù‚Ø³Ù….",
    intro:
      "Ù†Ø¸Ø§Ù… ØªØ¹Ù„Ù‘Ù… Ø¨ØµØ±ÙŠ Ù„Ù„Ù…Ù…Ø±Ø¶ÙŠÙ† ÙˆØ§Ù„Ù…Ù…Ø±Ø¶Ø§Øª Ø§Ù„Ø°ÙŠÙ† ÙŠØ±ÙŠØ¯ÙˆÙ† ØªÙˆØ§ØµÙ„Ø§Ù‹ Ø£ÙˆØ¶Ø­ØŒ ÙˆÙˆØ±Ø¯ÙŠØ© Ø£ÙƒØ«Ø± Ù‡Ø¯ÙˆØ¡Ù‹Ø§ØŒ ÙˆØ®Ø·ÙˆØ© ÙˆØ§Ø«Ù‚Ø© Ù†Ø­Ùˆ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ© Ø¨Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ©.",
    explore: "Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ù…Ø³Ø§Ø±",
    check: "Ø§Ø¹Ø±Ù Ù…Ø³ØªÙˆØ§ÙŠ",
    pathway: "ÙˆØ±Ø¯ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© ØªØ¨Ø¯Ø£ Ù…Ù† Ù‡Ù†Ø§.",
    pathwayText:
      "Ø§Ø¨Ù†Ù Ù„ØºØªÙƒ Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ© Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø¹Ø¨Ø± Ø«Ù„Ø§Ø« Ù…Ø±Ø§Ø­Ù„ Ù‡Ø§Ø¯Ø¦Ø©ØŒ Ù…Ù† Ø§Ù„ØªØ¹Ø§Ø±Ù Ø§Ù„Ø£ÙˆÙ„ Ø­ØªÙ‰ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø³Ø±ÙŠØ±ÙŠ Ø§Ù„Ø¯Ù‚ÙŠÙ‚.",
    library: "Ù…ÙƒØªØ¨ØªÙƒ Ø§Ù„Ù…Ù‡Ù†ÙŠØ©.",
    libraryText:
      "ÙƒØªØ§Ø¨ Ø¹Ù…Ù„ÙŠ ÙˆØ§Ø­Ø¯ ÙÙŠ ÙƒÙ„ Ù…Ø±Ø©ØŒ Ù…Ø¨Ù†ÙŠ Ø¹Ù„Ù‰ Ø§Ù„Ù„ØºØ© Ø§Ù„ØªÙŠ ÙŠØ³ØªØ®Ø¯Ù…Ù‡Ø§ Ø·Ø§Ù‚Ù… Ø§Ù„ØªÙ…Ø±ÙŠØ¶ ÙØ¹Ù„ÙŠÙ‹Ø§.",
    testTitle: "Ø§Ø¹Ø±Ù Ø®Ø·ÙˆØªÙƒ Ø§Ù„ØªØ§Ù„ÙŠØ©.",
    testText: "Ø§Ø®ØªØ¨Ø§Ø± A1.1 ÙŠØªØ¨Ø¹ Ø¯Ø±ÙˆØ³ Ø§Ù„ÙƒØªØ§Ø¨ ÙˆÙŠØ¹Ø·ÙŠÙƒ Ù†ØªÙŠØ¬Ø© ØªØ¯Ø±ÙŠØ¨ÙŠØ© ÙÙˆØ±ÙŠØ©.",
    start: "Ø§Ø¨Ø¯Ø£ Ø§Ù„ØªÙ‚ÙŠÙŠÙ…",
    result: "Ø§Ø¹Ø±Ø¶ Ù†ØªÙŠØ¬ØªÙŠ",
    score: "Ù†ØªÙŠØ¬ØªÙƒ",
    retry: "Ø£Ø¹Ø¯ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©",
    book: "Ø§Ø·Ù„Ø¨ Ø¹Ø¨Ø± Instagram",
    empty: "Ù‚Ø±ÙŠØ¨Ù‹Ø§",
    assistant: "Ø§Ø³Ø£Ù„ abdelrazaq",
    assistantIntro:
      "Ø£Ù‡Ù„Ù‹Ø§ØŒ Ø£Ù†Ø§ abdelrazaq. Ø£Ø³Ø§Ø¹Ø¯Ùƒ ÙÙŠ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…Ø³ØªÙˆÙ‰ Ø£Ùˆ Ø§Ù„ÙƒØªØ§Ø¨ Ø£Ùˆ Ø§Ù„ØªØ¯Ø±Ø¨ Ø¹Ù„Ù‰ Ø¬Ù…Ù„Ø© ØªÙ…Ø±ÙŠØ¶ÙŠØ©.",
    secure: "ØªØ¹Ù„Ù‘Ù… Ø¨ÙˆØ¶ÙˆØ­",
    learnLine: "ØªÙŽØ¹ÙŽÙ„ÙŽÙ‘Ù… Â· ØªÙŽØ¯ÙŽØ±ÙŽÙ‘Ø¨ Â· Ø§Ù‡ØªÙŽÙ…",
    share: "Ø´Ø§Ø±Ùƒ Ø§Ù„ÙƒØªØ§Ø¨",
    preview: "Ø´Ø§Ù‡Ø¯ Ø¹ÙŠÙ†Ø© Ù…Ø¬Ø§Ù†ÙŠØ©",
    reviews: "Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø·Ù„Ø§Ø¨",
    reviewsEmpty: "Ø³ØªØ¸Ù‡Ø± Ù‡Ù†Ø§ Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…ÙˆØ«Ù‚Ø©.",
    available: "Ù…ØªØ§Ø­ Ø§Ù„Ø¢Ù†",
    availableNote: "Ø§Ù„ØºÙ„Ø§Ù ÙˆØ§Ù„Ø¹ÙŠÙ†Ø© Ø§Ù„Ù…Ø¬Ø§Ù†ÙŠØ© ÙˆØ§Ù„Ø·Ù„Ø¨ Ø§Ù„Ù…Ø¨Ø§Ø´Ø± Ø¬Ø§Ù‡Ø²Ø©.",
    flagshipEyebrow: "Ø§Ù„ÙƒØªØ§Ø¨ Ø§Ù„Ø£ÙˆÙ„",
    flagshipTitle: "German for Nurse A1.1",
    flagshipText:
      "Ø®Ø·ÙˆØªÙƒ Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù„ØªØ¹Ù„Ù… Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ Ø¨Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ© ÙÙŠ Ù…Ø¬Ø§Ù„ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ©ØŒ Ù…Ø¹ Ø¯Ø±ÙˆØ³ Ø¨ØµØ±ÙŠØ© ÙˆÙ…ÙØ±Ø¯Ø§Øª Ù…ÙÙŠØ¯Ø© ÙˆØªØ¯Ø±ÙŠØ¨ Ù…Ù†Ø¸Ù….",
    orderGuide: "5 Ø¯Ù†Ø§Ù†ÙŠØ± Â· Ø·Ù„Ø¨ Ù…Ø¨Ø§Ø´Ø± Ø¹Ø¨Ø± Instagram",
    sampleNote: "Ø´Ø§Ù‡Ø¯ Ø£Ø±Ø¨Ø¹ ØµÙØ­Ø§Øª Ù‚Ø¨Ù„ Ø§ØªØ®Ø§Ø° Ø§Ù„Ù‚Ø±Ø§Ø±.",
    orderTitle: "Ø·Ø±ÙŠÙ‚ Ø¨Ø³ÙŠØ· Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ù†Ø³Ø®ØªÙƒ.",
    orderText:
      "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Checkout Ù…Ø¹Ù‚Ø¯. Ø§Ø®ØªØ± Ø§Ù„ÙƒØªØ§Ø¨ØŒ Ø´Ø§Ù‡Ø¯ Ø§Ù„Ø¹ÙŠÙ†Ø©ØŒ Ø«Ù… Ø£Ø±Ø³Ù„ Ø±Ø³Ø§Ù„Ø© Ù…Ø¨Ø§Ø´Ø±Ø© Ø¥Ù„Ù‰ @medical.sketcher.",
    stepOne: "Ø¹Ø§ÙŠÙ†",
    stepOneText: "Ø´Ø§Ù‡Ø¯ Ø£Ø±Ø¨Ø¹ ØµÙØ­Ø§Øª Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙˆØªØ¹Ø±Ù‘Ù Ø¹Ù„Ù‰ Ø£Ø³Ù„ÙˆØ¨ Ø§Ù„ÙƒØªØ§Ø¨ Ø§Ù„Ø¨ØµØ±ÙŠ.",
    stepTwo: "Ø£Ø±Ø³Ù„",
    stepTwoText: "Ø§ÙØªØ­ Ù…Ø­Ø§Ø¯Ø«Ø© Instagram Ø¨Ø±Ø³Ø§Ù„Ø© Ø·Ù„Ø¨ Ø¬Ø§Ù‡Ø²Ø©.",
    stepThree: "Ø§Ø³ØªÙ„Ù…",
    stepThreeText: "Ø£ÙƒØ¯ Ø§Ù„Ø¯ÙØ¹ ÙˆØ·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªØ³Ù„ÙŠÙ… Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø©.",
    faqTitle: "Ø£Ø³Ø¦Ù„Ø© Ù„Ù‡Ø§ Ø¥Ø¬Ø§Ø¨Ø§Øª.",
    faqOne: "Ù‡Ù„ A1.1 Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ†ØŸ",
    faqOneText:
      "Ù†Ø¹Ù…. ÙŠØ¨Ø¯Ø£ Ø¨Ø§Ù„ØªØ¹Ø§Ø±Ù ÙˆÙŠØ¨Ù†ÙŠ ØªØ¯Ø±ÙŠØ¬ÙŠÙ‹Ø§ Ù„ØºØ© Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„ÙŠÙˆÙ…ÙŠØ© ÙÙŠ Ø§Ù„ØªÙ…Ø±ÙŠØ¶.",
    faqTwo: "Ù…Ø§Ø°Ø§ Ø£Ø³ØªÙ„Ù…ØŸ",
    faqTwoText:
      "ÙŠØªÙ… ØªØ£ÙƒÙŠØ¯ ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙƒØªØ§Ø¨ ÙˆØ·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªØ³Ù„ÙŠÙ… Ù…Ø¹Ùƒ Ø¹Ø¨Ø± Instagram Ù‚Ø¨Ù„ Ø§Ù„Ø¯ÙØ¹.",
    faqThree: "Ù‡Ù„ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø´Ù‡Ø§Ø¯Ø§ØªØŸ",
    faqThreeText: "Ù„Ø§. Ù‡ÙŠ Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª ØªØ¯Ø±ÙŠØ¨ÙŠØ© ØªØ³Ø§Ø¹Ø¯Ùƒ Ø¹Ù„Ù‰ Ù‚ÙŠØ§Ø³ ØªÙ‚Ø¯Ù…Ùƒ.",
    feedbackTitle: "ØªÙ‚Ø¯Ù…Ùƒ ÙŠØ³ØªØ­Ù‚ Ø±Ø£ÙŠÙ‹Ø§ Ø­Ù‚ÙŠÙ‚ÙŠÙ‹Ø§.",
    feedbackText:
      "Ø¨Ø¹Ø¯ Ø¥ÙƒÙ…Ø§Ù„ Ø§Ù„ÙƒØªØ¨ Ø³Ù†Ø¯Ø¹Ùˆ Ø§Ù„Ø·Ù„Ø§Ø¨ Ù„Ù…Ø´Ø§Ø±ÙƒØ© Ø¢Ø±Ø§Ø¦Ù‡Ù… Ø¨ØµØ¯Ù‚. ÙˆØ­ØªÙ‰ Ø°Ù„Ùƒ Ø§Ù„ÙˆÙ‚Øª Ø³ÙŠØ¨Ù‚Ù‰ Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù… ÙØ§Ø±ØºÙ‹Ø§ Ø¹Ù† Ù‚ØµØ¯.",
    feedbackNote: "Ù„Ù† Ù†Ù†Ø´Ø± Ø¥Ù„Ø§ Ø§Ù„Ø¢Ø±Ø§Ø¡ Ø§Ù„Ù…ÙˆØ«Ù‚Ø© ÙˆØ§Ù„Ù…ÙˆØ§ÙÙ‚ Ø¹Ù„ÙŠÙ‡Ø§.",
    shareNotice: "ØªÙ… ÙØªØ­ Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„Ù…Ø´Ø§Ø±ÙƒØ©",
    shareFallback: "ØªÙ… Ù†Ø³Ø® Ø§Ù„Ø±Ø³Ø§Ù„Ø© ÙˆÙØªØ­ Instagram",
    chatTitle: "ØªØ¹Ù„Ù‘Ù… Ù…Ø¹ abdelrazaq",
    chatText:
      "Ø§Ø³Ø£Ù„ Ø¹Ù† Ù…Ø³ØªÙˆØ§Ùƒ Ø£Ùˆ Ø§Ù„ÙƒØªØ§Ø¨ Ø£Ùˆ Ø¬Ù…Ù„Ø© ØªÙ…Ø±ÙŠØ¶ÙŠØ© ØªØ­ØªØ§Ø¬Ù‡Ø§ ÙÙŠ ÙˆØ±Ø¯ÙŠØªÙƒ Ø§Ù„Ù‚Ø§Ø¯Ù…Ø©.",
    heroImageAlt: "Ø±Ø³Ù…Ø© Ù…Ù…Ø±Ø¶ ÙŠØªØ¹Ù„Ù… Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ©",
  },
};

const levelNotes: Record<
  Level,
  {
    number: string;
    name: Record<Locale, string>;
    note: Record<Locale, string>;
    tone: string;
  }
> = {
  "A1/A2": {
    number: "01",
    name: { en: "Foundation", de: "Grundlage", ar: "Ø§Ù„Ø£Ø³Ø§Ø³" },
    note: {
      en: "Greetings, introductions and essential care words.",
      de: "BegrÃ¼ÃŸungen, Vorstellungen und wichtige PflegewÃ¶rter.",
      ar: "Ø§Ù„ØªØ­ÙŠØ§Øª ÙˆØ§Ù„ØªØ¹Ø§Ø±Ù ÙˆÙ…ÙØ±Ø¯Ø§Øª Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©.",
    },
    tone: "from-[#e8edcf] via-[#f7ecdc] to-[#f4ddc8]",
  },
  "B1/B2": {
    number: "02",
    name: { en: "Confidence", de: "Sicherheit", ar: "Ø§Ù„Ø«Ù‚Ø©" },
    note: {
      en: "Professional routines, empathy and handovers.",
      de: "Berufsalltag, Empathie und Ãœbergaben.",
      ar: "Ø§Ù„Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù…Ù‡Ù†ÙŠ ÙˆØ§Ù„ØªØ¹Ø§Ø·Ù ÙˆØªØ³Ù„ÙŠÙ… Ø§Ù„Ù…Ù†Ø§ÙˆØ¨Ø§Øª.",
    },
    tone: "from-[#cbd9ae] via-[#e5eed6] to-[#d3e1c2]",
  },
  "C1/C2": {
    number: "03",
    name: { en: "Precision", de: "PrÃ¤zision", ar: "Ø§Ù„Ø¯Ù‚Ø©" },
    note: {
      en: "Clinical language, documentation and nuance.",
      de: "Klinische Sprache, Dokumentation und Nuancen.",
      ar: "Ø§Ù„Ù„ØºØ© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ ÙˆØ§Ù„ÙØ±ÙˆÙ‚ Ø§Ù„Ø¯Ù‚ÙŠÙ‚Ø©.",
    },
    tone: "from-[#80946f] via-[#aebd93] to-[#dbe4d3]",
  },
};

const shelves: Array<{
  id: Shelf;
  parent: "A" | "B" | "C";
  status: "available" | "soon";
  note: Record<Locale, string>;
}> = [
  {
    id: "A1.1",
    parent: "A",
    status: "available",
    note: {
      en: "The first practical workbook for nurses.",
      de: "Das erste praktische Arbeitsbuch fÃ¼r PflegekrÃ¤fte.",
      ar: "Ø§Ù„ÙƒØªØ§Ø¨ Ø§Ù„Ø¹Ù…Ù„ÙŠ Ø§Ù„Ø£ÙˆÙ„ Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„ØªÙ…Ø±ÙŠØ¶.",
    },
  },
  {
    id: "A1.2",
    parent: "A",
    status: "soon",
    note: {
      en: "The next foundation workbook is being prepared.",
      de: "Das nÃ¤chste Grundlagenbuch wird vorbereitet.",
      ar: "ÙŠØ¬Ø±ÙŠ Ø¥Ø¹Ø¯Ø§Ø¯ ÙƒØªØ§Ø¨ Ø§Ù„Ø£Ø³Ø§Ø³ Ø§Ù„ØªØ§Ù„ÙŠ.",
    },
  },
  {
    id: "B1.1",
    parent: "B",
    status: "soon",
    note: {
      en: "Professional care communication â€” coming soon.",
      de: "Professionelle Pflegekommunikation â€” bald verfÃ¼gbar.",
      ar: "Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ù‡Ù†ÙŠ ÙÙŠ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© â€” Ù‚Ø±ÙŠØ¨Ù‹Ø§.",
    },
  },
  {
    id: "B1.2",
    parent: "B",
    status: "soon",
    note: {
      en: "Confident ward routines and handovers â€” coming soon.",
      de: "Sichere Stationsroutinen und Ãœbergaben â€” bald verfÃ¼gbar.",
      ar: "Ø±ÙˆØªÙŠÙ† Ø§Ù„Ù‚Ø³Ù… ÙˆØªØ³Ù„ÙŠÙ… Ø§Ù„Ù…Ù†Ø§ÙˆØ¨Ø§Øª â€” Ù‚Ø±ÙŠØ¨Ù‹Ø§.",
    },
  },
  {
    id: "C1.1",
    parent: "C",
    status: "soon",
    note: {
      en: "Clinical precision and documentation â€” coming soon.",
      de: "Klinische PrÃ¤zision und Dokumentation â€” bald verfÃ¼gbar.",
      ar: "Ø§Ù„Ø¯Ù‚Ø© Ø§Ù„Ø³Ø±ÙŠØ±ÙŠØ© ÙˆØ§Ù„ØªÙˆØ«ÙŠÙ‚ â€” Ù‚Ø±ÙŠØ¨Ù‹Ø§.",
    },
  },
  {
    id: "C1.2",
    parent: "C",
    status: "soon",
    note: {
      en: "Advanced healthcare communication â€” coming soon.",
      de: "Fortgeschrittene Kommunikation im Gesundheitswesen â€” bald verfÃ¼gbar.",
      ar: "Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…ØªÙ‚Ø¯Ù… ÙÙŠ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ© â€” Ù‚Ø±ÙŠØ¨Ù‹Ø§.",
    },
  },
];

// These are public, stable image URLs so the storefront does not depend on the
// private Manus workspace storage paths that are unavailable on Render.
const heroCharacter = "/medical-sketcher-hero.jpg";
const bookFallback =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=85";
const lessonArt = "/medical-sketcher-method.jpg";
const studyArt = "/medical-sketcher-study-scene.jpg";
const a11Book = {
  id: "a1-1-instagram-book",
  title: "German for Nurse A1.1",
  descriptions: {
    en: "A practical first step for nurses learning essential German communication in healthcare.",
    de: "Ein praktischer Einstieg fÃ¼r PflegekrÃ¤fte in die wichtige Kommunikation im Gesundheitswesen.",
    ar: "Ø®Ø·ÙˆØªÙƒ Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù„ØªØ¹Ù„Ù… Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ Ø¨Ø§Ù„Ø£Ù„Ù…Ø§Ù†ÙŠØ© ÙÙŠ Ù…Ø¬Ø§Ù„ Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ©.",
  },
  images: [
    {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663893490517/QFCSGvpeAiQgscAr.jpg",
      altText: "German for Nurse A1.1 cover",
    },
  ],
};
const lessonFeedbackKeys = [
  ["a1-1-lesson-1", "Lesson 1 â€” Sich vorstellen"],
  ["a1-1-lesson-2", "Lesson 2 â€” Beruf & PersÃ¶nliches"],
  ["a1-1-lesson-3", "Lesson 3 â€” Familie & Sprachen"],
  ["a1-1-lesson-4", "Lesson 4 â€” MÃ¶bel & Preise"],
  ["a1-1-lesson-5", "Lesson 5 â€” Ein / Kein"],
  ["a1-1-lesson-6", "Lesson 6 â€” Telefon & Akkusativ"],
  ["a1-1-lesson-7", "Lesson 7 â€” Hobbys & kÃ¶nnen"],
  ["a1-1-lesson-8", "Lesson 8 â€” Termine & Uhrzeit"],
  ["a1-1-lesson-9", "Lesson 9 â€” Trennbare Verben"],
  ["a1-1-lesson-10", "Lesson 10 â€” Perfekt mit haben"],
  ["a1-1-lesson-11", "Lesson 11 â€” Perfekt mit sein"],
] as const;

function LessonFeedbackPanel({
  lessonKey,
  title,
  locale,
}: {
  lessonKey: string;
  title: string;
  locale: Locale;
}) {
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const feedback = trpc.feedback.list.useQuery({ lessonKey });
  const submit = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      setAuthorName("");
      setBody("");
      setRating(0);
      feedback.refetch();
    },
  });
  const labels =
    locale === "ar"
      ? {
          title: "Ø´Ø§Ø±Ùƒ Ø±Ø£ÙŠÙƒ ÙÙŠ Ø§Ù„Ø¯Ø±Ø³",
          empty: "Ù„Ø§ ØªÙˆØ¬Ø¯ ØªØ¹Ù„ÙŠÙ‚Ø§Øª Ù…Ø¹ØªÙ…Ø¯Ø© Ø¨Ø¹Ø¯.",
          name: "Ø§Ø³Ù…Ùƒ",
          comment: "Ù…Ø§ Ø±Ø£ÙŠÙƒ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø¯Ø±Ø³ØŸ",
          submit: "Ø£Ø±Ø³Ù„ Ù„Ù„ØªØ¯Ù‚ÙŠÙ‚",
          pending: "Ø³ÙŠØ¸Ù‡Ø± ØªØ¹Ù„ÙŠÙ‚Ùƒ Ø¨Ø¹Ø¯ Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©.",
          signIn: "ÙŠÙ…ÙƒÙ†Ùƒ Ø¥Ø±Ø³Ø§Ù„ Ø±Ø£ÙŠÙƒ Ø¯ÙˆÙ† ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„.",
        }
      : locale === "de"
        ? {
            title: "Deine Meinung zur Lektion",
            empty: "Noch keine freigegebenen Kommentare.",
            name: "Dein Name",
            comment: "Wie findest du diese Lektion?",
            submit: "Zur PrÃ¼fung senden",
            pending: "Dein Kommentar erscheint nach der PrÃ¼fung.",
            signIn: "Du kannst deine Meinung ohne Anmeldung senden.",
          }
        : {
            title: "Share your lesson feedback",
            empty: "No approved comments yet.",
            name: "Your name",
            comment: "What did you think of this lesson?",
            submit: "Send for review",
            pending: "Your comment will appear after review.",
            signIn: "You can share feedback without signing in.",
          };
  return (
    <div className="motion-lift mt-5 rounded-2xl border border-[#10283f]/10 bg-white/70 p-4 dark:border-[#c9d9c7]/15 dark:bg-[#24372d]/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[.14em] text-[#16849a]">
            {title}
          </p>
          <h4 className="mt-1 flex items-center gap-2 font-display text-lg font-bold">
            <MessageCircle className="size-4 text-[#e07a5f]" />
            {labels.title}
          </h4>
        </div>
        <span className="rounded-full bg-[#eaf4f6] px-2 py-1 text-[10px] text-[#64705c] dark:bg-[#314a3c] dark:text-[#d9e5d1]">
          {feedback.data?.length ?? 0}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {feedback.data?.map(item => (
          <div
            key={item.id}
            className="rounded-xl bg-[#f4f8fa] p-3 dark:bg-[#1c2b23]"
          >
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm">{item.authorName}</strong>
              <span
                className="flex text-[#e07a5f]"
                aria-label={`${item.rating} / 5`}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`size-3 ${index < item.rating ? "fill-current" : ""}`}
                  />
                ))}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-[#607487] dark:text-[#c2d0bf]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
      {!feedback.data?.length && (
        <p className="mt-3 text-xs text-[#71806b] dark:text-[#b9c9b8]">
          {labels.empty}
        </p>
      )}
      <form
        onSubmit={event => {
          event.preventDefault();
          if (rating && authorName.trim() && body.trim())
            submit.mutate({ lessonKey, authorName, rating, body });
        }}
        className="mt-4 border-t border-[#10283f]/10 pt-4 dark:border-[#c9d9c7]/15"
      >
        <p className="text-xs text-[#71806b] dark:text-[#b9c9b8]">
          {labels.signIn}
        </p>
        <div
          className="mt-3 flex items-center gap-1"
          aria-label="Choose rating"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setRating(index + 1)}
              aria-label={`${index + 1} stars`}
              className="rounded p-1 text-[#e07a5f] transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e07a5f]"
            >
              <Star
                className={`size-5 ${index < rating ? "fill-current" : ""}`}
              />
            </button>
          ))}
        </div>
        <input
          value={authorName}
          onChange={event => setAuthorName(event.target.value)}
          required
          maxLength={100}
          placeholder={labels.name}
          className="mt-3 w-full rounded-xl border border-[#10283f]/10 bg-[#ffffff] px-3 py-2 text-sm outline-none focus:border-[#16849a] dark:border-[#c9d9c7]/15 dark:bg-[#1c2b23]"
        />
        <textarea
          value={body}
          onChange={event => setBody(event.target.value)}
          required
          maxLength={1000}
          placeholder={labels.comment}
          rows={2}
          className="mt-2 w-full resize-none rounded-xl border border-[#10283f]/10 bg-[#ffffff] px-3 py-2 text-sm outline-none focus:border-[#16849a] dark:border-[#c9d9c7]/15 dark:bg-[#1c2b23]"
        />
        <button
          type="submit"
          disabled={submit.isPending || !rating}
          className="mt-3 rounded-full bg-[#10283f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#176b7d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submit.isPending ? "â€¦" : labels.submit}
        </button>
        {submit.isSuccess && (
          <p className="mt-2 text-xs text-[#16849a] dark:text-[#c9d9b7]">
            {labels.pending}
          </p>
        )}
      </form>
    </div>
  );
}

function ProductCard({
  product,
  label,
  locale,
  onPreview,
  onShare,
}: {
  product: typeof a11Book;
  label: string;
  locale: Locale;
  onPreview: () => void;
  onShare: () => void;
}) {
  const checkout = trpc.digitalProducts.demoCheckout.useMutation({
    onSuccess: data => {
      if (data.approvalUrl) window.location.href = data.approvalUrl;
      else toast.error("PayPal did not return a checkout link");
    },
    onError: error => toast.error(error.message),
  });
  return (
    <article
      data-reveal="card"
      className="group motion-reveal motion-lift overflow-hidden rounded-[2rem] border border-[#10283f]/10 bg-[#ffffff] p-4 shadow-[0_18px_50px_rgba(32,50,35,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(32,50,35,.14)]"
    >
      <button
        type="button"
        onClick={onPreview}
        className="block w-full text-start"
        aria-label="Preview German for Nurse A1.1"
      >
        <div className="relative aspect-[.76] overflow-hidden rounded-[1.5rem] bg-[#e5e9d9]">
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={product.images[0]?.url ?? bookFallback}
            alt={product.images[0]?.altText ?? product.title}
          />
          <span className="absolute start-3 top-3 rounded-full bg-[#10283f] px-3 py-1 text-[10px] font-bold tracking-[.14em] text-white">
            A1.1
          </span>
          <span className="absolute bottom-3 end-3 rounded-full bg-[#e07a5f] px-3 py-1 text-[10px] font-bold tracking-[.1em] text-white">
            5 JD
          </span>
        </div>
        <div className="px-1 pt-5">
          <h3 className="font-display text-2xl font-bold leading-tight">
            {product.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#607487]">
            {product.descriptions[locale]}
          </p>
        </div>
      </button>
      <div className="mt-4 rounded-2xl bg-[#eff2e8] p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#16849a]">
          <ShieldCheck className="size-4" />
          {text[locale].reviews}
        </div>
        <p className="mt-1 text-xs leading-5 text-[#71806b]">
          {text[locale].reviewsEmpty}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPreview}
          className="text-xs font-semibold text-[#16849a] underline underline-offset-4"
        >
          {text[locale].preview}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#16849a] hover:text-[#10283f]"
        >
          <Send className="size-3" />
          {text[locale].share}
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        <a
          href="https://ig.me/m/medical.sketcher"
          target="_blank"
          rel="noreferrer"
          aria-label="Order German for Nurse A1.1 through Instagram Direct"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#10283f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#176b7d]"
        >
          {label}
          <ArrowUpRight className="size-4" />
        </a>
        <button
          type="button"
          disabled={checkout.isPending}
          onClick={() => checkout.mutate()}
          aria-label="Pay with PayPal for German for Nurse A1.1"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#0070ba] bg-white px-4 py-3 text-sm font-semibold text-[#0070ba] transition hover:bg-[#eef7fc] disabled:opacity-60"
        >
          {checkout.isPending
            ? "Opening PayPalâ€¦"
            : "Pay with PayPal Â· approx. $7 USD (5 JOD)"}
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

function EmptyBook({
  level,
  label,
  note,
}: {
  level: Shelf;
  label: string;
  note: string;
}) {
  return (
    <article
      data-reveal="card"
      className="relative motion-reveal motion-lift min-h-[245px] overflow-hidden rounded-[2rem] border border-dashed border-[#16849a]/30 bg-[#eff2e8] p-6"
    >
      <div className="absolute -end-8 -top-8 size-36 rounded-full bg-[#d4e0b9]" />
      <BookOpen className="relative size-8 text-[#16849a]" />
      <p className="relative mt-12 text-xs font-bold tracking-[.16em] text-[#16849a]">
        {level}
      </p>
      <h3 className="relative mt-2 font-display text-2xl font-bold">{label}</h3>
      <p className="relative mt-3 max-w-[17rem] text-sm leading-6 text-[#68735e]">
        {note}
      </p>
    </article>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [level, setLevel] = useState<Level>("A1/A2");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("preview") === "a11"
  );
  const [shareNotice, setShareNotice] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([{ role: "assistant", content: text.en.assistantIntro }]);
  const { theme, toggleTheme } = useTheme();
  const t = text[locale];
  const quiz = trpc.learning.questions.list.useQuery({ level });
  const assistantProfile = trpc.studio.assistant.profile.useQuery();
  const assistantName = assistantProfile.data?.name ?? "abdelrazaq";
  const chat = trpc.assistant.chat.useMutation({
    onSuccess: output =>
      setMessages(current => [
        ...current,
        { role: "assistant", content: output.response },
      ]),
    onError: () =>
      setMessages(current => [
        ...current,
        { role: "assistant", content: "Please try again in a moment." },
      ]),
  });
  const questions = quiz.data ?? [];
  const score = questions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correctIndex ? 1 : 0),
    0
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    setMessages([
      {
        role: "assistant",
        content: assistantProfile.data?.greeting ?? t.assistantIntro,
      },
    ]);
  }, [locale, assistantProfile.data?.greeting, t.assistantIntro]);
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".motion-reveal")
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach(target => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  const chooseLevel = (next: Level) => {
    setLevel(next);
    setAnswers({});
    setShowResult(false);
    document.querySelector("#tests")?.scrollIntoView({ behavior: "smooth" });
  };
  const shareA11Book = async () => {
    const message =
      "German for Nurse A1.1 â€” practical German for nurses. Order via @medical.sketcher â€” 5 JD.";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "German for Nurse A1.1",
          text: message,
          url: window.location.href,
        });
        setShareNotice(t.shareNotice);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard?.writeText(message);
    } catch {
      /* Clipboard can be unavailable. */
    }
    window.open(
      "https://ig.me/m/medical.sketcher",
      "_blank",
      "noopener,noreferrer"
    );
    setShareNotice(t.shareFallback);
  };
  const send = (content: string) => {
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    chat.mutate({ messages: next });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8fa] text-[#1d2a1d]">
      <div className="border-b border-[#dce4d1] bg-[#10283f] px-5 py-2.5 text-center text-[11px] font-semibold tracking-[.08em] text-[#e8eedb]">
        {t.available}
        <span className="mx-2 text-[#a9be82]">â€¢</span>German for Nurse A1.1
        <span className="mx-2 text-[#a9be82]">â€¢</span>@medical.sketcher
      </div>
      <nav className="sticky top-0 z-50 border-b border-[#10283f]/10 bg-[#f4f8fa]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[.9rem] bg-[#10283f] font-display text-xl font-black text-[#e5ebce] shadow-sm">
              M
            </span>
            <span>
              <strong className="font-display text-xl tracking-tight">
                medical.sketcher
              </strong>
              <small className="block text-[9px] font-bold tracking-[.16em] text-[#6a765d]">
                GERMAN FOR NURSES
              </small>
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#books" className="transition hover:text-[#16849a]">
              {t.books}
            </a>
            <a href="#tests" className="transition hover:text-[#16849a]">
              {t.tests}
            </a>
            <a href="#method" className="transition hover:text-[#16849a]">
              {t.method}
            </a>
            <Link
              href="/admin"
              className="rounded-full border border-[#10283f]/15 px-4 py-2 transition hover:border-[#10283f]/40"
            >
              {t.owner}
            </Link>
            <Link
              href="/downloads"
              className="rounded-full border border-[#10283f]/15 px-4 py-2 transition hover:border-[#10283f]/40"
            >
              My downloads
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleTheme?.()}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-pressed={theme === "dark"}
              className="grid size-9 place-items-center rounded-full border border-[#10283f]/15 bg-white text-[#16849a] transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#c9d9c7]/20 dark:bg-[#24372d] dark:text-[#d9e5d1]"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            <div className="hidden rounded-full border border-[#10283f]/15 bg-white p-1 sm:flex">
              {(["en", "de", "ar"] as Locale[]).map(item => (
                <button
                  key={item}
                  onClick={() => setLocale(item)}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition ${locale === item ? "bg-[#10283f] text-white" : "text-[#6a765d] hover:bg-[#eaf4f6]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenu(value => !value)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileMenu && (
          <div className="border-t border-[#10283f]/10 bg-white px-5 py-5 md:hidden">
            <div className="grid gap-4 text-sm font-semibold">
              <a href="#books" onClick={() => setMobileMenu(false)}>
                {t.books}
              </a>
              <a href="#tests" onClick={() => setMobileMenu(false)}>
                {t.tests}
              </a>
              <a href="#method" onClick={() => setMobileMenu(false)}>
                {t.method}
              </a>
              <Link href="/admin">{t.owner}</Link>
              <div className="flex gap-2 pt-1">
                {(["en", "de", "ar"] as Locale[]).map(item => (
                  <button
                    key={item}
                    onClick={() => setLocale(item)}
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${locale === item ? "bg-[#10283f] text-white" : "bg-[#eaf4f6]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <section
        id="home"
        className="motion-reveal relative isolate overflow-hidden"
        data-reveal="hero"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_22%,#dce6c7_0,transparent_30%),radial-gradient(circle_at_8%_75%,#eddfc3_0,transparent_28%)]" />
        <div className="absolute -end-20 top-24 -z-10 size-80 rounded-full border-[28px] border-[#dce6c7]/45" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-28 pt-16 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:pb-36 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#16849a]/25 bg-white/75 px-4 py-2 text-[10px] font-bold tracking-[.18em] text-[#16849a]">
              <span className="size-2 rounded-full bg-[#e07a5f]" />
              {t.heroTag}
            </div>
            <h1 className="mt-7 max-w-2xl font-display text-5xl font-black leading-[.9] tracking-[-.06em] sm:text-6xl lg:text-[5.7rem]">
              {t.hero}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#586453]">
              {t.intro}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  document
                    .querySelector("#levels")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-full bg-[#10283f] px-6 py-6 text-sm shadow-[0_10px_25px_rgba(39,65,47,.2)] hover:bg-[#176b7d]"
              >
                {t.explore}
                <ArrowDown className="size-4" />
              </Button>
              <Button
                onClick={() => chooseLevel("A1/A2")}
                variant="outline"
                className="rounded-full border-[#10283f]/20 bg-white/60 px-6 py-6 text-sm"
              >
                {t.check}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-5">
              <div className="flex -space-x-3">
                <span className="grid size-11 place-items-center rounded-full border-2 border-[#f4f8fa] bg-[#dfe6c6] text-xs font-bold">
                  A1
                </span>
                <span className="grid size-11 place-items-center rounded-full border-2 border-[#f4f8fa] bg-[#bfce9e] text-xs font-bold">
                  B1
                </span>
                <span className="grid size-11 place-items-center rounded-full border-2 border-[#f4f8fa] bg-[#849872] text-xs font-bold text-white">
                  C1
                </span>
              </div>
              <p className="text-xs font-bold tracking-[.15em] text-[#64705c]">
                {t.learnLine}
              </p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-10 rounded-[4rem] bg-[#dbe5c5]/70 blur-3xl" />
            <div className="relative mx-auto aspect-[.85] max-w-[380px] rounded-[2.8rem] border border-white/80 bg-[#eff0e5] p-5 shadow-[0_38px_85px_rgba(36,52,30,.24)] [transform:rotate(4deg)]">
              <div className="absolute -start-8 top-20 z-20 rounded-2xl bg-[#ffffff] px-5 py-4 shadow-xl [transform:rotate(-8deg)]">
                <span className="block text-[10px] font-bold tracking-[.14em] text-[#849872]">
                  01 Â· DIALOGUE
                </span>
                <span className="font-display text-xl font-bold">
                  Guten Morgen.
                </span>
              </div>
              <img
                src={heroCharacter}
                alt={t.heroImageAlt}
                className="h-full w-full object-contain object-bottom [filter:drop-shadow(15px_22px_17px_rgba(35,54,30,.2))]"
              />
              <div className="absolute -bottom-7 -end-7 grid size-28 place-items-center rounded-full border-8 border-[#f4f8fa] bg-[#e07a5f] text-center font-display text-xl font-black leading-none text-white shadow-xl">
                3D
                <br />
                <span className="text-[9px] tracking-[.16em]">LEARN</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -start-2 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10283f]">
                <CheckCircle2 className="size-4 text-[#849872]" />
                Visual + practical
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="levels"
        className="motion-reveal bg-[#10283f] py-20 text-[#f4f8fa]"
        data-reveal="section"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-7 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-[#c8d5a9]">
                01 â€” PATHWAY
              </p>
              <h2 className="mt-4 max-w-md font-display text-4xl font-bold leading-tight sm:text-5xl">
                {t.pathway}
              </h2>
            </div>
            <p className="max-w-xl self-end text-base leading-8 text-[#dfe8d8]">
              {t.pathwayText}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(Object.keys(levelNotes) as Level[]).map(item => {
              const note = levelNotes[item];
              return (
                <button
                  key={item}
                  onClick={() => chooseLevel(item)}
                  className={`group motion-reveal motion-lift relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${note.tone} p-6 text-start text-[#23301f] shadow-[0_20px_45px_rgba(0,0,0,.13)] transition duration-300 hover:-translate-y-1`}
                >
                  <span className="font-display text-6xl font-black opacity-20">
                    {note.number}
                  </span>
                  <p className="mt-8 text-xs font-bold tracking-[.16em]">
                    {item}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold">
                    {note.name[locale]}
                  </h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-[#53604a]">
                    {note.note[locale]}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                    {t.start}
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                  <span className="absolute -bottom-10 -end-1 text-[9rem] font-black leading-none text-white/20">
                    +
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="method"
        className="motion-reveal relative overflow-hidden py-24"
        data-reveal="section"
      >
        <div className="absolute end-0 top-0 -z-10 h-full w-1/2 bg-[#ede9dc]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -start-8 -top-8 size-28 rounded-full border border-[#16849a]/25" />
            <div className="absolute -bottom-8 -end-8 size-40 rounded-full bg-[#c8edf1]/50" />
            <img
              src={lessonArt}
              alt="Visual German lesson"
              className="motion-image relative rounded-[2.2rem] border-8 border-white shadow-[0_24px_65px_rgba(38,49,29,.16)]"
            />
            <div className="absolute -bottom-5 -end-4 rounded-2xl bg-[#10283f] px-5 py-4 text-sm font-bold text-white shadow-xl">
              <Check className="me-2 inline size-4 text-[#d9e5bf]" />5 learning
              parts
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
              02 â€” THE METHOD
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              Dialogue. Vocabulary. Grammar. Practice.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#64705c]">
              {t.flagshipText}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [MessageCircle, "Dialogues"],
                [Languages, "10â€“15 words"],
                [BookOpen, "Grammar focus"],
                [BrainCircuit, "Practical exercises"],
              ].map(([Icon, label]) => (
                <div
                  key={String(label)}
                  className="motion-lift flex items-center gap-3 rounded-2xl border border-[#10283f]/8 bg-white/80 p-4 shadow-sm"
                >
                  <Icon className="size-5 text-[#16849a]" />
                  <span className="text-sm font-semibold">{String(label)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="books"
        className="motion-reveal bg-[#e7eadf] py-24"
        data-reveal="section"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                03 â€” BOOKS
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-bold sm:text-5xl">
                {t.library}
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[#607487]">
              {t.libraryText}
            </p>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <div className="rounded-[2.2rem] bg-[#10283f] p-7 text-[#f4f8fa] shadow-[0_22px_60px_rgba(39,65,47,.17)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[.18em] text-[#c8d5a9]">
                    {t.flagshipEyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold">
                    {t.flagshipTitle}
                  </h3>
                </div>
                <BookOpen className="size-7 text-[#c8edf1]" />
              </div>
              <p className="mt-6 text-sm leading-7 text-[#dfe8d8]">
                {t.flagshipText}
              </p>
              <div className="mt-8 space-y-3 text-sm">
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-[#c8d5a9]" />
                  {t.availableNote}
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-[#c8d5a9]" />
                  {t.sampleNote}
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-[#c8d5a9]" />
                  {t.orderGuide}
                </p>
              </div>
              <a
                href="https://ig.me/m/medical.sketcher"
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#e07a5f] px-5 py-3 text-sm font-bold text-white hover:bg-[#9c4b37]"
              >
                {t.book}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shelves.map(shelf => {
                const product = shelf.id === "A1.1" ? a11Book : null;
                return (
                  <section
                    key={shelf.id}
                    className="rounded-[2rem] border border-[#10283f]/10 bg-white/55 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-[.18em] text-[#16849a]">
                          LEVEL {shelf.parent}
                        </p>
                        <h3 className="font-display text-2xl font-bold">
                          {shelf.id}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[.1em] ${shelf.status === "available" ? "bg-[#c8edf1] text-[#10283f]" : "bg-[#f1e5cf] text-[#8a5d2d]"}`}
                      >
                        {shelf.status === "available"
                          ? t.available.toUpperCase()
                          : t.empty.toUpperCase()}
                      </span>
                    </div>
                    {product ? (
                      <ProductCard
                        product={product}
                        label={t.book}
                        locale={locale}
                        onPreview={() => setPreviewOpen(true)}
                        onShare={shareA11Book}
                      />
                    ) : (
                      <EmptyBook
                        level={shelf.id}
                        label={t.empty}
                        note={shelf.note[locale]}
                      />
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="order"
        className="motion-reveal relative overflow-hidden bg-[#f4f8fa] py-24"
        data-reveal="section"
      >
        <div className="absolute -start-24 top-12 size-72 rounded-full bg-[#eddfc3]/55 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
              04 â€” ORDER FLOW
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              {t.orderTitle}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#607487]">
              {t.orderText}
            </p>
          </div>
          <div className="mt-10 max-w-3xl overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_24px_65px_rgba(16,40,63,.12)]">
            <img
              src={studyArt}
              alt="Nurses practising a German handover conversation"
              className="h-64 w-full object-cover object-center sm:h-80"
              loading="lazy"
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [BookOpen, "01", t.stepOne, t.stepOneText],
              [Send, "02", t.stepTwo, t.stepTwoText],
              [HeartPulse, "03", t.stepThree, t.stepThreeText],
            ].map(([Icon, number, title, description]) => (
              <article
                key={String(number)}
                className="motion-lift rounded-[2rem] border border-[#10283f]/10 bg-white p-6 shadow-[0_15px_45px_rgba(39,65,47,.06)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-black text-[#dbe4c5]">
                    {String(number)}
                  </span>
                  <Icon className="size-6 text-[#16849a]" />
                </div>
                <h3 className="mt-10 font-display text-2xl font-bold">
                  {String(title)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#607487]">
                  {String(description)}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#10283f]/10 bg-[#eaf4f6] p-6">
              <div className="flex items-center gap-3">
                <Instagram className="size-5 text-[#16849a]" />
                <h3 className="font-display text-2xl font-bold">
                  @medical.sketcher
                </h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#607487]">
                {t.orderText}
              </p>
              <a
                href="https://ig.me/m/medical.sketcher"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#10283f] px-5 py-3 text-sm font-bold text-white hover:bg-[#176b7d]"
              >
                Open Instagram Direct <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="rounded-[2rem] bg-[#ede3cc] p-6">
              <h3 className="font-display text-2xl font-bold">{t.faqTitle}</h3>
              <div className="mt-4 space-y-2">
                {[
                  [t.faqOne, t.faqOneText],
                  [t.faqTwo, t.faqTwoText],
                  [t.faqThree, t.faqThreeText],
                ].map(([question, answer]) => (
                  <details
                    key={question}
                    className="group motion-lift rounded-xl bg-white/55 px-4 py-3"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                      {question}
                      <ChevronDown className="size-4 transition group-open:rotate-180" />
                    </summary>
                    <p className="pt-3 text-sm leading-6 text-[#607487]">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="tests"
        className="motion-reveal relative overflow-hidden bg-[#ffffff] py-24"
        data-reveal="section"
      >
        <div className="absolute -end-16 top-10 size-72 rounded-full bg-[#c8edf1]/45 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[#16849a]">
                05 â€” BOOK ASSESSMENTS
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
                {t.testTitle}
              </h2>
              <p className="mt-5 max-w-sm text-base leading-8 text-[#607487]">
                {t.testText}
              </p>
              <div className="mt-8 rounded-2xl bg-[#eaf4f6] p-5 text-sm leading-7 text-[#53604a]">
                <div className="flex items-center gap-2 font-semibold text-[#10283f]">
                  <ClipboardCheck className="size-5" />
                  A1.1 focus
                </div>
                <p className="mt-2">
                  Introductions, nursing professions, family, furniture, prices,
                  accusative, modal verbs, appointments, separable verbs and
                  perfect tense.
                </p>
              </div>
            </div>
            <div className="rounded-[2.2rem] border border-[#10283f]/10 bg-white p-6 shadow-[0_20px_60px_rgba(40,59,37,.09)] sm:p-8">
              {level === "A1/A2" ? (
                <>
                  {showResult ? (
                    <div className="grid min-h-[420px] place-items-center text-center">
                      <div>
                        <div className="mx-auto grid size-24 place-items-center rounded-full bg-[#c8edf1] font-display text-3xl font-black text-[#10283f]">
                          {score}/{questions.length}
                        </div>
                        <p className="mt-7 text-xs font-bold tracking-[.16em] text-[#16849a]">
                          A1.1 ASSESSMENT
                        </p>
                        <h3 className="mt-3 font-display text-3xl font-bold">
                          {score / Math.max(questions.length, 1) >= 0.7
                            ? "Well done"
                            : "Keep practising"}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[#607487]">
                          {t.score}: {score} / {questions.length}
                        </p>
                        <Button
                          className="mt-6 rounded-full bg-[#10283f]"
                          onClick={() => {
                            setAnswers({});
                            setShowResult(false);
                          }}
                        >
                          {t.retry}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold tracking-[.16em] text-[#16849a]">
                            A1.1 ASSESSMENT
                          </p>
                          <h3 className="mt-2 font-display text-3xl font-bold">
                            30 questions
                          </h3>
                        </div>
                        <div className="grid size-11 place-items-center rounded-full bg-[#eaf4f6]">
                          <CheckCircle2 className="size-5 text-[#16849a]" />
                        </div>
                      </div>
                      <div className="mt-7 max-h-[560px] space-y-8 overflow-auto pe-2">
                        {questions.map((question, index) => (
                          <div key={question.id}>
                            <p className="text-xs font-bold tracking-[.1em] text-[#16849a]">
                              {index + 1} / {questions.length}
                            </p>
                            <h4 className="mt-2 font-display text-xl font-bold leading-snug">
                              {question.prompt}
                            </h4>
                            <div className="mt-3 grid gap-2">
                              {question.choices.map((choice, choiceIndex) => (
                                <button
                                  key={choice}
                                  type="button"
                                  onClick={() =>
                                    setAnswers(current => ({
                                      ...current,
                                      [question.id]: choiceIndex,
                                    }))
                                  }
                                  className={`rounded-xl border px-4 py-3 text-start text-sm transition ${answers[question.id] === choiceIndex ? "border-[#16849a] bg-[#c8edf1] font-semibold" : "border-[#10283f]/10 bg-[#ffffff] hover:border-[#16849a]/50"}`}
                                >
                                  <span className="me-2 inline-grid size-5 place-items-center rounded-full border border-current text-[10px]">
                                    {String.fromCharCode(65 + choiceIndex)}
                                  </span>
                                  {choice}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="mt-8 rounded-full bg-[#16849a] px-6"
                        disabled={
                          Object.keys(answers).length !== questions.length
                        }
                        onClick={() => setShowResult(true)}
                      >
                        {t.result}
                        <ArrowUpRight className="size-4" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[.16em] text-[#16849a]">
                        ASSESSMENT LIBRARY
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold">
                        {t.empty}
                      </h3>
                    </div>
                    <ClipboardCheck className="size-9 text-[#16849a]" />
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {shelves
                      .filter(shelf => shelf.id !== "A1.1")
                      .map(shelf => (
                        <div
                          key={shelf.id}
                          className="rounded-2xl border border-dashed border-[#16849a]/25 bg-[#eaf4f6] p-4"
                        >
                          <span className="text-[10px] font-bold tracking-[.15em] text-[#16849a]">
                            FINAL ASSESSMENT
                          </span>
                          <p className="mt-2 font-display text-2xl font-bold">
                            {shelf.id}
                          </p>
                          <span className="mt-4 inline-block rounded-full bg-[#f1e5cf] px-3 py-1 text-[10px] font-bold tracking-[.1em] text-[#8a5d2d]">
                            {t.empty.toUpperCase()}
                          </span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-10 rounded-[2rem] border border-[#10283f]/10 bg-[#eaf4f6] p-5 dark:border-[#c9d9c7]/15 dark:bg-[#1f3026]">
            <div className="flex items-center gap-3">
              <MessageCircle className="size-5 text-[#e07a5f]" />
              <div>
                <p className="text-[10px] font-bold tracking-[.16em] text-[#16849a]">
                  LESSON VOICES
                </p>
                <h3 className="font-display text-2xl font-bold">
                  {locale === "ar"
                    ? "Ø´Ø§Ø±Ùƒ Ø±Ø£ÙŠÙƒ ØªØ­Øª ÙƒÙ„ Ø¯Ø±Ø³"
                    : locale === "de"
                      ? "Teile deine Meinung unter jeder Lektion"
                      : "Share your thoughts under each lesson"}
                </h3>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {lessonFeedbackKeys.map(([lessonKey, title]) => (
                <LessonFeedbackPanel
                  key={lessonKey}
                  lessonKey={lessonKey}
                  title={title}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="feedback"
        className="motion-reveal bg-[#d9f0f1] py-20"
        data-reveal="section"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[#71845d]">
              06 â€” LEARNER VOICES
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              {t.feedbackTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#596852]">
              {t.feedbackText}
            </p>
          </div>
          <div
            data-reveal="card"
            className="motion-reveal motion-lift rounded-[2rem] border border-[#16849a]/20 bg-[#f4f8fa]/70 p-6"
          >
            <ShieldCheck className="size-7 text-[#16849a]" />
            <h3 className="mt-5 font-display text-2xl font-bold">
              {t.reviews}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#607487]">
              {t.reviewsEmpty}
            </p>
            <div className="mt-5 rounded-xl bg-white/60 px-4 py-3 text-xs font-semibold text-[#16849a]">
              {t.feedbackNote}
            </div>
          </div>
        </div>
      </section>

      {previewOpen && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-[#172019]/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="A1.1 free sample"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close preview overlay"
          />
          <div className="relative flex h-[min(88vh,760px)] w-full max-w-4xl flex-col overflow-hidden rounded-[1.8rem] bg-[#ffffff] shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#10283f]/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-[.16em] text-[#16849a]">
                  A1.1 FREE SAMPLE
                </p>
                <h3 className="font-display text-xl font-bold">
                  German for Nurse A1.1
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/manus-storage/a1-1-preview_e9cef788.pdf"
                  download="German-for-Nurse-A1.1-free-sample.pdf"
                  className="inline-flex items-center gap-2 rounded-full bg-[#10283f] px-3 py-2 text-xs font-semibold text-white hover:bg-[#176b7d]"
                >
                  <Download className="size-4" />
                  Download sample
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(false)}
                  aria-label="Close preview"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-auto bg-[#f4f8fa] p-4 sm:p-7">
              {[
                "/a1-1-preview-1.png",
                "/a1-1-preview-2.png",
                "/a1-1-preview-3.png",
                "/a1-1-preview-4.png",
              ].map((page, index) => (
                <img
                  key={page}
                  src={page}
                  alt={`A1.1 preview page ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto w-full max-w-2xl rounded-xl shadow-md"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#1e2b1e] py-14 text-[#edf0e5]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-[1.4fr_.8fr_.8fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#c8edf1] font-display text-lg font-black text-[#10283f]">
                M
              </span>
              <strong className="font-display text-xl">medical.sketcher</strong>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#c8d0c0]">
              German language learning for the care profession â€” structured,
              visual and practical.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-[#c8d5a9]">
              EXPLORE
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#c8d0c0]">
              <a href="#books" className="hover:text-white">
                {t.books}
              </a>
              <a href="#tests" className="hover:text-white">
                {t.tests}
              </a>
              <a href="#method" className="hover:text-white">
                {t.method}
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-[#c8d5a9]">
              LEGAL
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[#c8d0c0]">
              <Link
                href={
                  locale === "ar"
                    ? "/ar/terms"
                    : locale === "de"
                      ? "/de/terms"
                      : "/terms"
                }
                className="underline underline-offset-4 hover:text-white"
              >
                {locale === "ar"
                  ? "Ø´Ø±ÙˆØ· Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…"
                  : locale === "de"
                    ? "Nutzungsbedingungen"
                    : "Terms of use"}
              </Link>
              <Link
                href={
                  locale === "ar"
                    ? "/ar/privacy"
                    : locale === "de"
                      ? "/de/privacy"
                      : "/privacy"
                }
                className="underline underline-offset-4 hover:text-white"
              >
                {locale === "ar"
                  ? "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©"
                  : locale === "de"
                    ? "Datenschutz"
                    : "Privacy policy"}
              </Link>
              <span className="text-xs text-[#9da995]">
                Arabic Â· English Â· Deutsch
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-xs text-[#9da995] lg:px-8">
          Â© medical.sketcher Â· {t.secure}
        </div>
              <div className="mx-auto max-w-7xl px-5 pt-3 text-xs text-[#9da995] lg:px-8">
          Designed & Developed by muhammad_allouzi
        </div>
      </footer>

      {shareNotice && (
        <div
          className="fixed bottom-5 start-5 z-[80] rounded-full bg-[#10283f] px-4 py-3 text-xs font-semibold text-white shadow-xl"
          role="status"
        >
          {shareNotice}
        </div>
      )}
      <div className="fixed bottom-5 end-5 z-[70] flex flex-col items-end gap-3">
        <div className="w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-[1.6rem] bg-white shadow-2xl">
          {chatOpen && (
            <>
              <div className="flex items-center justify-between bg-[#10283f] px-5 py-4 text-white">
                <div>
                  <strong className="font-display text-lg">
                    {assistantName}
                  </strong>
                  <p className="text-[10px] tracking-[.15em] text-[#c8edf1]">
                    AI STUDY ASSISTANT
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close assistant"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="px-5 pt-3 text-sm font-semibold text-[#10283f]">
                {t.chatTitle}
                <p className="mt-1 text-xs font-normal leading-5 text-[#71806b]">
                  {t.chatText}
                </p>
              </div>
              <AIChatBox
                messages={messages}
                onSendMessage={send}
                isLoading={chat.isPending}
                height="360px"
                placeholder={
                  locale === "ar"
                    ? `Ø§Ø³Ø£Ù„ ${assistantName}â€¦`
                    : locale === "de"
                      ? `Frage ${assistantName}â€¦`
                      : `Ask ${assistantName}â€¦`
                }
                suggestedPrompts={
                  locale === "ar"
                    ? ["Ø£ÙŠ Ù…Ø³ØªÙˆÙ‰ Ø£Ø®ØªØ§Ø±ØŸ", "Ù…Ø§ Ù…Ø­ØªÙˆÙ‰ ÙƒØªØ§Ø¨ A1.1ØŸ"]
                    : locale === "de"
                      ? ["Welches Niveau passt?", "Was enthÃ¤lt A1.1?"]
                      : ["Which level should I choose?", "What is in A1.1?"]
                }
              />
            </>
          )}
        </div>
        <Button
          onClick={() => setChatOpen(value => !value)}
          className="h-14 rounded-full bg-[#e07a5f] px-5 shadow-xl hover:bg-[#9c4b37]"
        >
          <Sparkles className="size-4" />
          {chatOpen ? "Close" : t.assistant}
        </Button>
      </div>
    </main>
  );
}
