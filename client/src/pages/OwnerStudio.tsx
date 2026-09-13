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
      <div className="grid min-h-screen place-items-center bg-[#f4f1e9] text-[#10283f]">
        Loading owner studio…
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1e9] px-6">
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
          className="max-w-md rounded-[2rem] bg-white p-10 text-center shadow-xl"
        >
          <ShieldCheck className="mx-auto mb-5 size-12 text-[#556b2f]" />
          <h1 className="font-display text-3xl font-bold">Owner access</h1>
          <p className="mt-3 text-sm text-[#607487]">
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
            <p className="mt-3 text-sm text-[#8d4133]">{loginError}</p>
          )}
          <Button
            type="submit"
            disabled={loggingIn}
            className="mt-6 rounded-full bg-[#10283f] px-7"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    );
  if (!canAdmin)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1e9] px-6">
        <div className="max-w-md rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <ShieldCheck className="mx-auto mb-5 size-12 text-[#8d4133]" />
          <h1 className="font-display text-3xl font-bold">Owner access only</h1>
          <p className="mt-3 text-sm text-[#607487]">
            This account does not have administrator permission.
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
    <main className="min-h-screen bg-[#f4f1e9] text-[#1d281c]">
      <header className="border-b border-[#10283f]/10 bg-[#ffffff]">
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
          <span className="text-sm text-[#607487]">
            {user?.name ?? "Owner"}
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-7 lg:grid-cols-[16rem_1fr]">
          <aside className="rounded-[1.8rem] bg-[#10283f] p-4 text-white shadow-xl">
            <div className="border-b border-white/15 px-3 pb-5">
              <p className="text-[10px] font-bold tracking-[.18em] text-[#c9d9aa]">
                CONTROL CENTER
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold">
                Owner tools
              </h1>
            </div>
            <nav className="mt-4 grid gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPanel(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${panel === item.id ? "bg-[#c8edf1] text-[#10283f]" : "text-[#e8eddf] hover:bg-white/10"}`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-xs leading-5 text-[#dfe7d4]">
                For page design, text and colours, use the visual editor from
                the project Preview panel.
              </p>
            </div>
          </aside>
          <section className="min-w-0">
            {panel === "overview" && (
              <div className="space-y-7">
                <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
                  <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                    OWNER OVERVIEW
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-bold">
                    Everything you need, in one place.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-[#607487]">
                    Use this studio to prepare course levels, build assessments,
                    guide the AI assistant and connect to real sales management.
                    Publishing a book or assessment should happen only after its
                    content is ready.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-[#eaf4f6] p-5">
                      <BookOpen className="size-5 text-[#16849a]" />
                      <strong className="mt-5 block font-display text-3xl">
                        {publishedCount}/6
                      </strong>
                      <span className="text-sm text-[#69735f]">
                        published levels
                      </span>
                    </div>
                    <div className="rounded-2xl bg-[#f4ead8] p-5">
                      <ClipboardCheck className="size-5 text-[#a16a32]" />
                      <strong className="mt-5 block font-display text-3xl">
                        {questions.data?.length ?? 0}
                      </strong>
                      <span className="text-sm text-[#69735f]">
                        questions in {level}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-[#e6ece0] p-5">
                      <Bot className="size-5 text-[#16849a]" />
                      <strong className="mt-5 block font-display text-xl">
                        {assistantDraft.name}
                      </strong>
                      <span className="text-sm text-[#69735f]">
                        AI assistant name
                      </span>
                    </div>
                    <div className="rounded-2xl bg-[#e9e4db] p-5">
                      <CircleDollarSign className="size-5 text-[#6e604d]" />
                      <strong className="mt-5 block font-display text-xl">
                        Shopify
                      </strong>
                      <span className="text-sm text-[#69735f]">
                        sales control
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    [
                      "1",
                      "Prepare content",
                      "Set a level note and mark it ready when the book is approved.",
                    ],
                    [
                      "2",
                      "Add assessment",
                      "Create questions based only on the book’s real units and vocabulary.",
                    ],
                    [
                      "3",
                      "Publish safely",
                      "Activate the book and complete product, price and payment settings.",
                    ],
                  ].map(([number, title, body]) => (
                    <div
                      key={number}
                      className="rounded-[1.5rem] border border-[#10283f]/10 bg-white p-6"
                    >
                      <span className="font-display text-4xl font-black text-[#d1dbba]">
                        {number}
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-bold">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#607487]">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {panel === "content" && (
              <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                      BOOKS & LEVELS
                    </p>
                    <h2 className="mt-2 font-display text-4xl font-bold">
                      Control the learning shelves.
                    </h2>
                  </div>
                  <p className="max-w-xs text-sm leading-6 text-[#607487]">
                    A level can be hidden, held as coming soon, or marked
                    published after its content is ready.
                  </p>
                </div>
                <div className="mt-8 grid gap-4">
                  {shelves.isLoading ? (
                    <p className="py-10 text-center text-[#607487]">
                      Loading levels…
                    </p>
                  ) : (
                    shelves.data?.map(shelf => {
                      const draft = shelfDrafts[shelf.id] ?? {
                        title: shelf.title,
                        status: shelf.status,
                        note: shelf.note,
                      };
                      return (
                        <article
                          key={shelf.id}
                          className="rounded-[1.5rem] border border-[#10283f]/10 bg-[#f8f6ee] p-5"
                        >
                          <div className="grid gap-4 md:grid-cols-[7rem_1fr_10rem_auto]">
                            <div>
                              <p className="text-[10px] font-bold tracking-[.15em] text-[#16849a]">
                                SHELF
                              </p>
                              <strong className="font-display text-3xl">
                                {shelf.id}
                              </strong>
                            </div>
                            <div className="grid gap-2">
                              <Input
                                value={draft.title}
                                onChange={event =>
                                  setShelfDrafts(current => ({
                                    ...current,
                                    [shelf.id]: {
                                      ...draft,
                                      title: event.target.value,
                                    },
                                  }))
                                }
                                aria-label={`${shelf.id} title`}
                              />
                              <Textarea
                                value={draft.note}
                                rows={2}
                                onChange={event =>
                                  setShelfDrafts(current => ({
                                    ...current,
                                    [shelf.id]: {
                                      ...draft,
                                      note: event.target.value,
                                    },
                                  }))
                                }
                                aria-label={`${shelf.id} note`}
                              />
                            </div>
                            <select
                              value={draft.status}
                              onChange={event =>
                                setShelfDrafts(current => ({
                                  ...current,
                                  [shelf.id]: {
                                    ...draft,
                                    status: event.target.value as ShelfStatus,
                                  },
                                }))
                              }
                              className="h-10 rounded-md border border-[#10283f]/15 bg-white px-3 text-sm font-semibold"
                            >
                              <option value="coming_soon">Coming soon</option>
                              <option value="published">Published</option>
                              <option value="hidden">Hidden</option>
                            </select>
                            <Button
                              onClick={() => saveShelf(shelf.id)}
                              disabled={updateShelf.isPending}
                              className="rounded-full bg-[#10283f]"
                            >
                              <Save className="mr-2 size-4" />
                              Save
                            </Button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            {panel === "assessments" && (
              <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                      ASSESSMENTS
                    </p>
                    <h2 className="mt-2 font-display text-4xl font-bold">
                      Build questions with control.
                    </h2>
                  </div>
                  <p className="max-w-xs text-sm leading-6 text-[#607487]">
                    Only add questions after reviewing the book content. The
                    public assessment area stays coming soon until you activate
                    it.
                  </p>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {(["A1/A2", "B1/B2", "C1/C2"] as Level[]).map(item => (
                    <button
                      key={item}
                      onClick={() => setLevel(item)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${level === item ? "bg-[#16849a] text-white" : "bg-[#eef0e6] text-[#53604b]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-[#f8f6ee] p-5">
                  <Input
                    value={prompt}
                    onChange={event => setPrompt(event.target.value)}
                    placeholder="Write a multiple-choice question in German"
                  />
                  <Textarea
                    value={choicesText}
                    onChange={event => setChoicesText(event.target.value)}
                    rows={4}
                    placeholder="One choice per line"
                  />
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold">
                      Correct answer (0–3)
                    </label>
                    <Input
                      className="w-20"
                      value={correctIndex}
                      onChange={event => setCorrectIndex(event.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                  <Button
                    onClick={addQuestion}
                    disabled={createQuestion.isPending}
                    className="w-fit rounded-full bg-[#10283f]"
                  >
                    <Plus className="mr-2 size-4" />
                    Add question
                  </Button>
                </div>
                <div className="mt-7 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-[.14em] text-[#16849a]">
                    Current {level} questions
                  </h3>
                  {questions.data?.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex gap-4 rounded-2xl bg-[#f4f1e9] p-4"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d9e2bf] text-xs font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{question.prompt}</p>
                        <p className="mt-1 text-xs text-[#607487]">
                          Correct: {question.choices[question.correctIndex]}
                        </p>
                      </div>
                      {question.id > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#8d4133]"
                          onClick={() =>
                            deleteQuestion.mutate({ id: question.id })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {panel === "feedback" && <FeedbackModeration />}
            {panel === "assistant" && (
              <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
                <div>
                  <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                    AI ASSISTANT
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-bold">
                    Shape how your assistant helps.
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-[#607487]">
                    These settings control the assistant identity, its opening
                    message and its general support scope. Keep the scope
                    focused on navigation and learning support, not medical or
                    payment advice.
                  </p>
                </div>
                <div className="mt-8 grid max-w-3xl gap-5">
                  <div>
                    <label className="text-sm font-bold">Assistant name</label>
                    <Input
                      className="mt-2"
                      value={assistantDraft.name}
                      onChange={event =>
                        setAssistantDraft(current => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold">Opening message</label>
                    <Textarea
                      className="mt-2"
                      rows={3}
                      value={assistantDraft.greeting}
                      onChange={event =>
                        setAssistantDraft(current => ({
                          ...current,
                          greeting: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold">Support scope</label>
                    <Textarea
                      className="mt-2"
                      rows={6}
                      value={assistantDraft.scope}
                      onChange={event =>
                        setAssistantDraft(current => ({
                          ...current,
                          scope: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    onClick={() => updateAssistant.mutate(assistantDraft)}
                    disabled={updateAssistant.isPending}
                    className="w-fit rounded-full bg-[#10283f]"
                  >
                    <Sparkles className="mr-2 size-4" />
                    Save assistant settings
                  </Button>
                </div>
              </div>
            )}
            {panel === "commerce" && (
              <>
                <ProductManager />
                <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
                  <p className="text-xs font-bold tracking-[.18em] text-[#16849a]">
                    SALES & PAYMENTS
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-bold">
                    Manage real sales through the store.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-[#607487]">
                    Products, prices, checkout, orders and payment providers are
                    managed in the connected Shopify store. This separation
                    keeps payment credentials and customer payment data out of
                    the learning website.
                  </p>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-[#eaf4f6] p-5">
                      <BookOpen className="size-5 text-[#16849a]" />
                      <h3 className="mt-5 font-display text-2xl font-bold">
                        Products
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#607487]">
                        Add book title, price, cover, description and level tag.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f4ead8] p-5">
                      <CircleDollarSign className="size-5 text-[#a16a32]" />
                      <h3 className="mt-5 font-display text-2xl font-bold">
                        Payments
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#607487]">
                        Activate PayPal, Stripe Card Payments or another
                        supported provider.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#e6ece0] p-5">
                      <ClipboardCheck className="size-5 text-[#16849a]" />
                      <h3 className="mt-5 font-display text-2xl font-bold">
                        Orders
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#607487]">
                        Review paid orders and fulfilment in the store
                        dashboard.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      toast.message(
                        "Open Settings → Integrations → Shopify in the project panel to claim and manage the connected store."
                      )
                    }
                    className="mt-7 rounded-full bg-[#10283f]"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Open sales setup steps
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
