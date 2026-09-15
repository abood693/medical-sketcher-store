import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FileUp, Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

type UploadStatus = "queued" | "uploading" | "ready" | "publishing" | "published" | "error";
type BookUpload = {
  id: string;
  file: File;
  title: string;
  description: string;
  price: string;
  pdfKey: string;
  progress: number;
  status: UploadStatus;
  error?: string;
};

const MAX_BOOK_BYTES = 2 * 1024 * 1024 * 1024;
const DEFAULT_CHUNK_SIZE = 8 * 1024 * 1024;

function cleanTitle(fileName: string) {
  return fileName.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
}

function ownerToken() {
  try {
    const raw = sessionStorage.getItem("manus-cookie");
    const pair = raw?.split(";").find(item => item.trim().startsWith("app_session_id="));
    return pair?.trim().slice("app_session_id=".length) ?? "";
  } catch {
    return "";
  }
}

async function uploadBook(file: File, onProgress: (value: number) => void) {
  const token = ownerToken();
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const start = await fetch("/api/admin/digital-products/upload-pdf/start", {
    method: "POST",
    credentials: "include",
    headers: { "X-Upload-Size": String(file.size), ...authHeaders },
  });
  const startData = (await start.json().catch(() => ({}))) as {
    uploadId?: string;
    chunkSize?: number;
    error?: string;
  };
  if (!start.ok || !startData.uploadId) {
    throw new Error(startData.error || `Could not start upload (${start.status})`);
  }
  const chunkSize = startData.chunkSize || DEFAULT_CHUNK_SIZE;
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const chunk = file.slice(offset, Math.min(offset + chunkSize, file.size));
    const end = offset + chunk.size - 1;
    const response = await fetch(
      `/api/admin/digital-products/upload-pdf/${startData.uploadId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Range": `bytes ${offset}-${end}/${file.size}`,
          ...authHeaders,
        },
        body: chunk,
      }
    );
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) throw new Error(data.error || `Chunk failed (${response.status})`);
    onProgress(Math.round(((offset + chunk.size) / file.size) * 95));
  }
  const complete = await fetch(
    `/api/admin/digital-products/upload-pdf/${startData.uploadId}/complete`,
    {
      method: "POST",
      credentials: "include",
      headers: { "X-File-Name": file.name, ...authHeaders },
    }
  );
  const result = (await complete.json().catch(() => ({}))) as {
    key?: string;
    error?: string;
  };
  if (!complete.ok || !result.key) {
    throw new Error(result.error || `Could not complete upload (${complete.status})`);
  }
  onProgress(100);
  return result.key;
}

export default function ProductManager() {
  const [queue, setQueue] = useState<BookUpload[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const products = trpc.digitalProducts.adminList.useQuery();
  const utils = trpc.useUtils();
  const create = trpc.digitalProducts.adminCreate.useMutation();
  const remove = trpc.digitalProducts.adminDelete.useMutation();

  const updateItem = (id: string, patch: Partial<BookUpload>) =>
    setQueue(items => items.map(item => (item.id === id ? { ...item, ...patch } : item)));

  const addFiles = (files: FileList | File[]) => {
    const additions = Array.from(files).filter(file => {
      if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
        toast.error(`${file.name}: PDF files only`);
        return false;
      }
      if (file.size > MAX_BOOK_BYTES) {
        toast.error(`${file.name}: maximum size is 2 GB`);
        return false;
      }
      return true;
    });
    if (!additions.length) return;
    setQueue(items => [
      ...items,
      ...additions.map(file => ({
        id: crypto.randomUUID(),
        file,
        title: cleanTitle(file.name),
        description: "",
        price: "5",
        pdfKey: "",
        progress: 0,
        status: "queued" as const,
      })),
    ]);
  };

  const uploadOne = async (item: BookUpload) => {
    updateItem(item.id, { status: "uploading", error: undefined, progress: 0 });
    try {
      const pdfKey = await uploadBook(item.file, progress => updateItem(item.id, { progress }));
      updateItem(item.id, { pdfKey, progress: 100, status: "ready" });
    } catch (error) {
      updateItem(item.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const uploadAll = async () => {
    const pending = queue.filter(item => item.status === "queued" || item.status === "error");
    let cursor = 0;
    const worker = async () => {
      while (cursor < pending.length) {
        const item = pending[cursor++];
        await uploadOne(item);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  };

  const publishOne = async (item: BookUpload) => {
    const priceCents = Math.round(Number(item.price) * 100);
    if (!item.title.trim() || !item.description.trim() || !item.pdfKey || !Number.isFinite(priceCents) || priceCents <= 0) {
      updateItem(item.id, { error: "Complete title, description, price and upload first" });
      return;
    }
    updateItem(item.id, { status: "publishing", error: undefined });
    try {
      await create.mutateAsync({
        title: item.title.trim(),
        description: item.description.trim(),
        priceCents,
        currency: "JOD",
        pdfKey: item.pdfKey,
        status: "published",
      });
      updateItem(item.id, { status: "published", progress: 100 });
      await utils.digitalProducts.adminList.invalidate();
    } catch (error) {
      updateItem(item.id, {
        status: "ready",
        error: error instanceof Error ? error.message : "Could not publish book",
      });
    }
  };

  const deletePublishedBook = async (id: number, title: string) => {
    if (!window.confirm(`Remove “${title}” from the store?`)) return;
    try {
      await remove.mutateAsync({ id });
      await utils.digitalProducts.adminList.invalidate();
      toast.success("Book removed from the store");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove book");
    }
  };

  const queuedCount = queue.filter(item => item.status === "queued" || item.status === "error").length;
  const activeCount = queue.filter(item => item.status === "uploading" || item.status === "publishing").length;

  return (
    <section className="mb-7 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(16,40,63,.08)]">
      <div className="border-b border-slate-100 bg-gradient-to-br from-[#f1f8fb] via-white to-[#f8fbfc] p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[.18em] text-[#16849a]">Secure library · bulk upload</div>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#10283f]">Upload your library</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Add many private PDF books at once. Each book has its own details, progress bar and publish button.
            </p>
          </div>
          <span className="rounded-full bg-[#eaf6f8] px-3 py-2 text-xs font-bold text-[#16849a]">
            {products.data?.length ?? 0} published
          </span>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={event => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
          className={`mt-6 flex min-h-36 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${dragging ? "border-[#16849a] bg-[#eaf8fa]" : "border-[#9ed1db] bg-[#f4fbfc] hover:border-[#16849a]"}`}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-white text-[#16849a] shadow-sm"><UploadCloud className="size-5" /></span>
          <strong className="mt-3 text-sm text-[#10283f]">Drop multiple PDF books here or browse files</strong>
          <small className="mt-1 text-xs text-slate-500">PDF only · up to 2 GB per book · chunked and resumable-friendly</small>
        </button>
        <input ref={fileRef} hidden multiple type="file" accept="application/pdf,.pdf" onChange={event => { if (event.target.files) addFiles(event.target.files); event.currentTarget.value = ""; }} />

        {queue.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-600">{queue.length} book{queue.length === 1 ? "" : "s"} in upload queue</span>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void uploadAll()} disabled={activeCount > 0 || queuedCount === 0} className="rounded-full bg-[#10283f] hover:bg-[#174769]">
                <UploadCloud className="mr-2 size-4" /> Upload {queuedCount} {queuedCount === 1 ? "book" : "books"}
              </Button>
              <Button variant="ghost" onClick={() => setQueue([])} disabled={activeCount > 0} className="rounded-full text-slate-500">Clear queue</Button>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-4">
          {queue.map(item => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf6f8] text-[#16849a]"><FileUp className="size-4" /></span>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-[#10283f]">{item.file.name}</strong>
                    <p className="mt-1 text-xs text-slate-500">{(item.file.size / 1024 / 1024).toFixed(1)} MB · {item.status === "uploading" ? `Uploading ${item.progress}%` : item.status}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${item.status === "error" ? "bg-red-400" : item.status === "published" ? "bg-emerald-500" : "bg-[#16849a]"}`} style={{ width: `${item.progress}%` }} /></div>
                    {item.error && <p className="mt-2 text-xs font-semibold text-red-600">{item.error}</p>}
                  </div>
                </div>
                <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:max-w-xl">
                  <Input value={item.title} onChange={event => updateItem(item.id, { title: event.target.value })} placeholder="Book title" className="rounded-xl" disabled={item.status === "published"} />
                  <Input value={item.price} onChange={event => updateItem(item.id, { price: event.target.value })} placeholder="Price in JOD" inputMode="decimal" className="rounded-xl" disabled={item.status === "published"} />
                  <Textarea value={item.description} onChange={event => updateItem(item.id, { description: event.target.value })} placeholder="Description shown to learners" rows={2} className="rounded-xl sm:col-span-2" disabled={item.status === "published"} />
                </div>
                <div className="flex shrink-0 gap-2 lg:flex-col">
                  {item.status === "queued" || item.status === "error" ? <Button variant="outline" onClick={() => void uploadOne(item)} disabled={activeCount > 0} className="rounded-full"><UploadCloud className="mr-2 size-4" />Retry upload</Button> : null}
                  {item.status === "ready" ? <Button onClick={() => void publishOne(item)} className="rounded-full bg-[#394b2b] hover:bg-[#526b37]"><Plus className="mr-2 size-4" />Publish</Button> : null}
                  {item.status === "uploading" || item.status === "publishing" ? <Button disabled className="rounded-full"><Loader2 className="mr-2 size-4 animate-spin" />Working…</Button> : null}
                  {item.status !== "published" && item.status !== "uploading" && item.status !== "publishing" ? <Button variant="ghost" size="icon" onClick={() => setQueue(items => items.filter(candidate => candidate.id !== item.id))} className="rounded-full text-slate-400 hover:text-red-600" aria-label="Remove book"><Trash2 className="size-4" /></Button> : null}
                  {item.status === "published" ? <span className="rounded-full bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-700">Published</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="p-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#10283f]">Published catalogue</h3>
          <span className="rounded-full bg-[#eaf6f8] px-3 py-1 text-xs font-bold text-[#16849a]">{products.data?.length ?? 0} books</span>
        </div>
        <div className="space-y-3">
          {products.data?.filter(item => item.status !== "hidden").map(item => (
            <div key={item.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
              <div><strong className="text-[#10283f]">{item.title}</strong><p className="mt-1 text-xs text-slate-500">{(item.priceCents / 100).toFixed(2)} {item.currency} · {item.status} · PDF secured</p></div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Ready for sale</span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={remove.isPending}
                  onClick={() => void deletePublishedBook(item.id, item.title)}
                  className="rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          {!products.data?.length && <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No books published yet. Add your first books above.</p>}
        </div>
      </div>
    </section>
  );
}
