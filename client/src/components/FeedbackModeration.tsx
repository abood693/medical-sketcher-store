import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Check, MessageSquareText, X } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackModeration() {
  const utils = trpc.useUtils();
  const feedback = trpc.feedback.admin.list.useQuery();
  const setStatus = trpc.feedback.admin.setStatus.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.feedback.admin.list.invalidate(), utils.feedback.list.invalidate()]);
      toast.success("Feedback status updated.");
    },
  });
  return <div className="rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]"><div><p className="text-xs font-bold tracking-[.18em] text-[#89966d]">LESSON FEEDBACK</p><h2 className="mt-2 font-display text-4xl font-bold">Review learner voices.</h2><p className="mt-3 max-w-2xl leading-7 text-[#667064]">Only approved comments appear below lessons. Review the name, rating and text before publishing.</p></div><div className="mt-8 space-y-3">{feedback.isLoading && <p className="py-10 text-center text-[#667064]">Loading feedback…</p>}{feedback.data?.length === 0 && <div className="rounded-2xl bg-[#eef1e4] p-6 text-sm text-[#667064]">No learner feedback has been submitted yet.</div>}{feedback.data?.map(item => <article key={item.id} className="rounded-2xl border border-[#283b25]/10 bg-[#f8f6ee] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><MessageSquareText className="size-4 text-[#536d37]" /><strong>{item.authorName}</strong><span className="text-[#b45b43]">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span></div><p className="mt-2 text-xs font-semibold uppercase tracking-[.12em] text-[#89966d]">{item.lessonKey}</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] ${item.status === "approved" ? "bg-[#dce6c8] text-[#27412f]" : item.status === "rejected" ? "bg-[#f2d8d1] text-[#8d4133]" : "bg-[#f1e5cf] text-[#8a5d2d]"}`}>{item.status}</span></div><p className="mt-4 text-sm leading-7 text-[#4f5d4b]">{item.body}</p><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => setStatus.mutate({ id: item.id, status: "approved" })} disabled={setStatus.isPending || item.status === "approved"} className="rounded-full bg-[#536d37]"><Check className="mr-1 size-3" />Approve</Button><Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: item.id, status: "rejected" })} disabled={setStatus.isPending || item.status === "rejected"} className="rounded-full border-[#8d4133]/30 text-[#8d4133]"><X className="mr-1 size-3" />Reject</Button></div></article>)}</div></div>;
}
