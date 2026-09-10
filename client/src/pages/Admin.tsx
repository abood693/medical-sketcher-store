import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BookOpen, ClipboardList, ExternalLink, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import ProductManager from "@/components/ProductManager";

type Level = "A1/A2" | "B1/B2" | "C1/C2";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [level, setLevel] = useState<Level>("A1/A2");
  const [prompt, setPrompt] = useState("");
  const [choicesText, setChoicesText] = useState("Option one\nOption two\nOption three\nOption four");
  const [correctIndex, setCorrectIndex] = useState("0");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const questions = trpc.learning.questions.list.useQuery({ level });
  const utils = trpc.useUtils();
  const createQuestion = trpc.learning.admin.createQuestion.useMutation({ onSuccess: async () => { await utils.learning.questions.list.invalidate({ level }); setPrompt(""); toast.success("Question saved to the level test."); } });
  const deleteQuestion = trpc.learning.admin.deleteQuestion.useMutation({ onSuccess: async () => { await utils.learning.questions.list.invalidate({ level }); toast.success("Question removed."); } });
  const parsedChoices = useMemo(() => choicesText.split("\n").map(item => item.trim()).filter(Boolean), [choicesText]);
  const canAdmin = user?.role === "admin";

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f4f1e9] text-[#283b25]">Loading owner dashboard…</div>;
  if (!isAuthenticated) return <div className="grid min-h-screen place-items-center bg-[#f4f1e9] px-6"><form onSubmit={async event => { event.preventDefault(); setLoggingIn(true); setLoginError(""); try { const response = await fetch("/api/local-admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }); if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || "Sign in failed"); } window.location.reload(); } catch (error) { setLoginError(error instanceof Error ? error.message : "Sign in failed"); } finally { setLoggingIn(false); } }} className="max-w-md rounded-[2rem] bg-white p-10 text-center shadow-xl"><ShieldCheck className="mx-auto mb-5 size-12 text-[#556b2f]" /><h1 className="font-display text-3xl font-bold">Owner access</h1><p className="mt-3 text-sm text-[#667064]">Sign in with the owner account to administer courses and the book catalogue.</p><div className="mt-6 grid gap-3 text-left"><Input aria-label="Username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Username" autoComplete="username" /><Input aria-label="Password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Password" type="password" autoComplete="current-password" /></div>{loginError && <p className="mt-3 text-sm text-[#8d4133]">{loginError}</p>}<Button type="submit" disabled={loggingIn} className="mt-6 rounded-full bg-[#283b25] px-7">{loggingIn ? "Signing in…" : "Sign in"}</Button></form></div>;
  if (!canAdmin) return <div className="grid min-h-screen place-items-center bg-[#f4f1e9] px-6"><div className="max-w-md rounded-[2rem] bg-white p-10 text-center shadow-xl"><ShieldCheck className="mx-auto mb-5 size-12 text-[#8d4133]" /><h1 className="font-display text-3xl font-bold">Owner access only</h1><p className="mt-3 text-sm text-[#667064]">This account does not have administrator permission.</p><Link href="/"><Button variant="outline" className="mt-6 rounded-full">Back to platform</Button></Link></div></div>;

  const addQuestion = () => {
    if (!prompt.trim() || parsedChoices.length !== 4 || Number(correctIndex) > 3) { toast.error("Enter a question and exactly four choices."); return; }
    createQuestion.mutate({ level, prompt, choices: parsedChoices, correctIndex: Number(correctIndex) });
  };

  return <main className="min-h-screen bg-[#f4f1e9] text-[#1d281c]"><header className="border-b border-[#283b25]/10 bg-[#fffdf7]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" /> Platform</Link><span className="font-display text-xl font-bold">medical.sketcher owner studio</span><span className="text-sm text-[#667064]">{user?.name ?? "Owner"}</span></div></header><div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 lg:grid-cols-[.82fr_1.18fr]"><section className="rounded-[2rem] bg-[#283b25] p-8 text-[#f9f6eb]"><BookOpen className="size-8 text-[#d7dfbc]" /><p className="mt-6 text-xs font-bold tracking-[.18em] text-[#d7dfbc]">BOOKS & CHECKOUT</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight">Manage the store catalogue with confidence.</h1><p className="mt-5 text-sm leading-6 text-[#e7eadc]">Books, pricing, secure checkout and fulfillment are managed through the connected commerce catalogue. Claim the store in project settings, then use its protected product dashboard to add or update real books.</p><Button className="mt-7 rounded-full bg-[#d9e2bf] text-[#283b25] hover:bg-white" onClick={() => toast.message("Claim the connected store in Settings → Integrations → Shopify to manage live book products.")}><ExternalLink className="mr-2 size-4" /> Open catalogue setup</Button></section><section className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[.18em] text-[#8a966e]">LEVEL TESTS</p><h2 className="mt-2 font-display text-3xl font-bold">Question manager</h2></div><ClipboardList className="size-8 text-[#556b2f]" /></div><div className="mt-6 flex flex-wrap gap-2">{(["A1/A2", "B1/B2", "C1/C2"] as Level[]).map(item => <button key={item} onClick={() => setLevel(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${level === item ? "bg-[#556b2f] text-white" : "bg-[#eef0e6] text-[#53604b]"}`}>{item}</button>)}</div><div className="mt-6 grid gap-3"><Input value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Write a multiple-choice question in German" /><Textarea value={choicesText} onChange={event => setChoicesText(event.target.value)} rows={4} placeholder="One choice per line" /><div className="flex items-center gap-3"><label className="text-sm font-semibold">Correct answer (0–3)</label><Input className="w-20" value={correctIndex} onChange={event => setCorrectIndex(event.target.value)} inputMode="numeric" /></div><Button onClick={addQuestion} disabled={createQuestion.isPending} className="w-fit rounded-full bg-[#283b25]"><Plus className="mr-2 size-4" /> Add question</Button></div><div className="mt-8 space-y-3"><h3 className="text-sm font-bold uppercase tracking-[.14em] text-[#8a966e]">Current {level} test</h3>{questions.data?.map((question, index) => <div key={question.id} className="flex gap-4 rounded-2xl bg-[#f4f1e9] p-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d9e2bf] text-xs font-bold">{index + 1}</span><div className="min-w-0 flex-1"><p className="font-medium">{question.prompt}</p><p className="mt-1 text-xs text-[#667064]">Correct: {question.choices[question.correctIndex]}</p></div>{question.id > 0 && <Button variant="ghost" size="icon" className="text-[#8d4133]" onClick={() => deleteQuestion.mutate({ id: question.id })}><Trash2 className="size-4" /></Button>}</div>)}</div></section></div></main>;
}
