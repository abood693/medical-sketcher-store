import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FeedbackModeration from "@/components/FeedbackModeration";
import ProductManager from "@/components/ProductManager";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Bot,
  BookOpen,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  ExternalLink,
  Eye,
  LayoutDashboard,
  Loader2,
  MessageSquareText,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

type Panel =
  | "overview"
  | "content"
  | "assessments"
  | "assistant"
  | "feedback"
  | "commerce";
type Level = "A1/A2" | "B1/B2" | "C1/C2";
type ShelfStatus = "coming_soon" | "published" | "hidden";

const statusLabel: Record<ShelfStatus, string> = {
  coming_soon: "Coming soon",
  published: "Published",
  hidden: "Hidden",
};

export default function OwnerStudio() {
  const { user, loading, isAuthenticated } = useAuth();
  const [panel, setPanel] = useState<Panel>("overview");
  const [level, setLevel] = useState<Level>("A1/A2");
  const [prompt, setPrompt] = useState("");
  const [choicesText, setChoicesText] = useState(
    "Option one\nOption two\nOption three\nOption four"
  );
  const [correctIndex, setCorrectIndex] = useState("0");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [shelfDrafts, setShelfDrafts] = useState<
    Record<string, { title: string; status: ShelfStatus; note: string }>
  >({});
  const [assistantDraft, setAssistantDraft] = useState({
    name: "abdelrazaq",
    greeting: "",
    scope: "",
  });
  const utils = trpc.useUtils();
  const shelves = trpc.studio.shelves.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const assistant = trpc.studio.assistant.get.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const questions = trpc.learning.questions.list.useQuery(
    { level },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const createQuestion = trpc.learning.admin.createQuestion.useMutation({
    onSuccess: async () => {
      await utils.learning.questions.list.invalidate({ level });
      setPrompt("");
      toast.success("Question saved to the level test.");
    },
  });
  const deleteQuestion = trpc.learning.admin.deleteQuestion.useMutation({
    onSuccess: async () => {
      await utils.learning.questions.list.invalidate({ level });
      toast.success("Question removed.");
    },
  });
  const updateShelf = trpc.studio.shelves.update.useMutation({
    onSuccess: async () => {
      await utils.studio.shelves.list.invalidate();
      toast.success("Level settings saved.");
    },
  });
  const updateAssistant = trpc.studio.assistant.update.useMutation({
    onSuccess: async () => {
      await utils.studio.assistant.get.invalidate();
      toast.success("Assistant settings saved.");
    },
  });

  useEffect(() => {
    if (!shelves.data) return;
    setShelfDrafts(
      Object.fromEntries(
        shelves.data.map(item => [
          item.id,
          { title: item.title, status: item.status, note: item.note },
        ])
      )
    );
  }, [shelves.data]);

  useEffect(() => {
    if (assistant.data) setAssistantDraft(assistant.data);
  }, [assistant.data]);

  const parsedChoices = useMemo(
    () =>
      choicesText
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean),
    [choicesText]
  );
  const canAdmin = user?.role === "admin";
  const publishedCount =
    shelves.data?.filter(item => item.status === "published").length ?? 0;

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1e5] text-[#3f4a2b]">
        Loading owner studio…
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f4f1e5] px-6">
        <div className="pointer-events-none absolute -left-24 -top-16 h-64 w-64 rotate-[18deg] bg-[#7c8c4a]/15" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 -rotate-12 bg-[#7c8c4a]/15" />
        <form
          onSubmit={async event => {
            event.preventDefault();
            setLoggingIn(true);
            setLoginError("");
            try {
              const response = await fetch("/api/local-admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
              if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Sign in failed");
              }
              window.location.reload();
            } catch (error) {
              setLoginError(
                error instanceof Error ? error.message : "Sign in failed"
              );
            } finally {
              setLoggingIn(false);
            }
          }}
          className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2"
        >
          <div className="hidden items-center justify-center bg-[#eef1e0] p-6 md:flex">
            <img
              src="/medical-sketcher-communication-scene.jpg"
              alt="medical.sketcher"
              className="w-full rounded-2xl object-cover"
            />
          </div>
          <div className="p-10 text-center md:text-left">
            <ShieldCheck className="mx-auto mb-5 size-12 text-[#556b2f] md:mx-0" />
            <h1 className="font-display text-3xl font-bold">Owner access</h1>
            <p className="mt-3 text-sm text-[#6f6a56]">
              Sign in with the owner account to administer the platform.
            </p>
            <div className="mt-6 grid gap-3 text-left">
              <Input
                aria-label="Username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
              <Input
                aria-label="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="mt-3 text-sm text-[#a0522d]">{loginError}</p>
            )}
            <Button
              type="submit"
              disabled={loggingIn}
              className="mt-6 w-full rounded-full bg-[#3f4a2b] px-7 md:w-fit"
            >
              {loggingIn ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    );
  if (!canAdmin)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1e5] px-6">
        <div className="max-w-md rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <ShieldCheck className="mx-auto mb-5 size-12 text-[#a0522d]" />
          <h1 className="font-display text-3xl font-bold">Owner access only</h1>
          <p className="mt-3 text-sm text-[#6f6a56]">
Curently this account does not have administrator permission.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6 rounded-full">
              Back to platform
            </Button>
          </Link>
        </div>
      </div>
    );

  const addQuestion = () => {
    if (
      !prompt.trim() ||
      parsedChoices.length !== 4 ||
      Number(correctIndex) < 0 ||
      Number(correctIndex) > 3
    ) {
      toast.error("Enter a question and exactly four choices.");
      return;
    }
    createQuestion.mutate({
      level,
      prompt,
      choices: parsedChoices,
      correctIndex: Number(correctIndex),
    });
  };
  const saveShelf = (id: string) => {
    const draft = shelfDrafts[id];
    if (!draft) return;
    updateShelf.mutate({
      id: id as "A1.1" | "A1.2" | "B1.1" | "B1.2" | "C1.1" | "C1.2",
      ...draft,
    });
  };

  const navItems: Array<{
    id: Panel;
    label: string;
    icon: typeof LayoutDashboard;
  }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "content", label: "Books & levels", icon: BookOpen },
    { id: "assessments", label: "Assessments", icon: ClipboardCheck },
    { id: "assistant", label: "AI assistant", icon: Bot },
    { id: "feedback", label: "Lesson feedback", icon: MessageSquareText },
    { id: "commerce", label: "Books & PayPal", icon: CircleDollarSign },
  ];

  return (
    <main className="min-h-screen bg-[#f4f1e5] text-[#1d281c]">
      <header className="border-b border-[#3f4a2b]/10 bg-[#ffffff]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" /> View site
          </Link>
          <span className="font-display text-xl font-bold">
            medical.sketcher owner studio
          </span>
          <span className="text-sm text-[#6f6a56]">
            {user?.name ?? "Owner"}
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-7 lg:grid-cols-[16rem_1fr]">
          <aside className="overflow-hidden rounded-[1.8rem] bg-[#3f4a2b] p-4 text-white shadow-xl">
            <div className="border-b border-white/15 px-3 pb-5">
              <p className="text-[10px] font-bold tracking-[.18em] text-[#c9d9aa]">
                CONTROL CENTER
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold">
                Owner tools
              </h1>
            </div>
            <div className="mx-1 mt-4 overflow-hidden rounded-2xl bg-white/5">
              <img
                src="/medical-//etc... shortened for brevity in internal context but fully written in file
