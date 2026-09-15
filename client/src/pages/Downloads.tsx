import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, Loader2, LockKeyhole } from "lucide-react";
import { Link } from "wouter";

export default function Downloads() {
  const library = trpc.digitalProducts.myLibrary.useQuery();
  return (
    <main className="min-h-screen bg-[#f4f8fa] px-5 py-10 text-[#10283f]">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#16849a]">
          <ArrowLeft className="size-4" /> Back to store
        </Link>
        <div className="mt-8 rounded-[2rem] bg-white p-7 shadow-[0_20px_70px_rgba(16,40,63,.08)] sm:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf6f8] text-[#16849a]"><LockKeyhole className="size-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#16849a]">Private library</p>
              <h1 className="mt-2 font-display text-3xl font-bold">Your downloads</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Files are private and available only to the account that completed the purchase.</p>
            </div>
          </div>
          {library.isLoading && <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" /> Loading your library…</div>}
          {library.isError && <p className="mt-8 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Please sign in with the purchasing account to view downloads.</p>}
          {!library.isLoading && !library.isError && !library.data?.length && <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No purchased books yet.</p>}
          <div className="mt-6 grid gap-3">
            {library.data?.map(book => (
              <div key={`${book.productId}-${book.purchasedAt}`} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
                <div><strong className="text-[#10283f]">{book.title}</strong><p className="mt-1 text-xs text-slate-500">Private download link · expires automatically</p></div>
                <a href={book.downloadUrl} target="_blank" rel="noreferrer" download>
                  <Button className="w-full rounded-full bg-[#10283f] hover:bg-[#174769] sm:w-auto"><Download className="mr-2 size-4" /> Download</Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
