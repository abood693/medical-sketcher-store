export type ShelfId = "A1.1" | "A1.2" | "B1.1" | "B1.2" | "C1.1" | "C1.2";
export type ShelfStatus = "coming_soon" | "published" | "hidden";

export const SHELF_DEFAULTS: Array<{ id: ShelfId; title: string; status: ShelfStatus; note: string }> = [
  { id: "A1.1", title: "A1.1", status: "coming_soon", note: "This level will be published after its book and assessment content are supplied." },
  { id: "A1.2", title: "A1.2", status: "coming_soon", note: "The next foundation workbook is being prepared." },
  { id: "B1.1", title: "B1.1", status: "coming_soon", note: "Professional care communication — coming soon." },
  { id: "B1.2", title: "B1.2", status: "coming_soon", note: "Confident ward routines and handovers — coming soon." },
  { id: "C1.1", title: "C1.1", status: "coming_soon", note: "Clinical precision and documentation — coming soon." },
  { id: "C1.2", title: "C1.2", status: "coming_soon", note: "Advanced healthcare communication — coming soon." },
];

export const DEFAULT_ASSISTANT_CONFIG = {
  name: "abdelrazaq",
  greeting: "Hello, I’m abdelrazaq. I can help you find a book, a level test or your next lesson.",
  scope: "Help learners find books and assessments, explain how to use the platform, and provide brief German-for-nursing learning support.",
};
