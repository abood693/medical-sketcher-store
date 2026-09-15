import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  FileUp,
  Loader2,
  Pencil,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pdfKey, setPdfKey] = useState("");
  const [fileName, setFileName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const products = trpc.digitalProducts.adminList.useQuery();
  const utils = trpc.useUtils();
  const reset = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setPdfKey("");
    setFileName("");
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const create = trpc.digitalProducts.adminCreate.useMutation({
    onSuccess: () => {
      reset();
      utils.digitalProducts.adminList.invalidate();
      toast.success("Book added to the library");
    },
    onError: e => toast.error(e.message),
  });
  const update = trpc.digitalProducts.adminUpdate.useMutation({
    onSuccess: () => {
      reset();
      utils.digitalProducts.adminList.invalidate();
      toast.success("Book updated");
    },
    onError: e => toast.error(e.message),
  });
  const onFile = async (file?: File) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf)
      return toast.error("Please choose a PDF file");
    if (file.size > 2 * 1024 * 1024 * 1024)
      return toast.error("PDF must be smaller than 2 GB");
    setFileName(file.name);
    setPdfKey("");
    setUploading(true);
    try {
      const raw = sessionStorage.getItem("manus-cookie");
      const pair = raw
        ?.split(";")
        .find(item => item.trim().startsWith("app_session_id="));
      const token = pair?.trim().slice("app_session_id=".length) ?? "";
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
        throw new Error(startData.error || `Upload failed (${start.status})`);
      }
      const chunkSize = startData.chunkSize || 8 * 1024 * 1024;
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
        if (!response.ok) throw new Error(data.error || `Upload failed (${response.status})`);
      }
      const complete = await fetch(
        `/api/admin/digital-products/upload-pdf/${startData.uploadId}/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: { "X-File-Name": file.name, ...authHeaders },
        }
      );
      const data = (await complete.json().catch(() => ({}))) as {
        key?: string;
        error?: string;
      };
      if (!complete.ok || !data.key) {
        throw new Error(data.error || `Upload failed (${complete.status})`);
      }
      setPdfKey(data.key);
      toast.success("PDF uploaded securely");
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };
  const edit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setPrice(String(item.priceCents / 100));
    setPdfKey(item.pdfKey);
    setFileName("Existing PDF");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const save = () => {
    const priceCents = Math.round(Number(price) * 100);
    if (
      !title.trim() ||
      !description.trim() ||
      !Number.isFinite(priceCents) ||
      priceCents <= 0 ||
      !pdfKey
    )
      return toast.error(
        "Complete the title, description, price and PDF first"
      );
    const input = {
      title: title.trim(),
      description: description.trim(),
      priceCents,
      currency: "JOD" as const,
      pdfKey,
      status: "published" as const,
    };
    if (editingId) update.mutate({ ...input, id: editingId });
    else create.mutate(input);
  };
  const saving = create.isPending || update.isPending;
  return (
    <section className="mb-7 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(16,40,63,.08)]">
      <div className="border-b border-slate-100 bg-gradient-to-br from-[#f1f8fb] via-white to-[#f8fbfc] p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#16849a]">
              <ShieldCheck className="size-4" /> Secure library
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#10283f]">
              {editingId ? "Edit a book" : "Add a new book"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Upload the private PDF, set the public details, and publish it to
              the storefront without exposing the original file.
            </p>
          </div>
          {editingId && (
            <Button variant="outline" onClick={reset} className="rounded-full">
              <X className="mr-2 size-4" />
              Cancel edit
            </Button>
          )}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Book title"
            className="h-12 rounded-xl bg-white"
          />
          <Input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price in JOD, e.g. 5"
            inputMode="decimal"
            className="h-12 rounded-xl bg-white"
          />
          <Textarea
            className="min-h-28 rounded-xl bg-white md:col-span-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description shown to learners"
            rows={3}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group flex min-h-28 items-center gap-4 rounded-2xl border-2 border-dashed border-[#9ed1db] bg-[#f4fbfc] px-5 text-start transition hover:border-[#16849a] hover:bg-[#edf9fb]"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-[#16849a] shadow-sm">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </span>
            <span>
              <strong className="block text-sm text-[#10283f]">
                {uploading
                  ? "Uploading securely…"
                  : fileName || "Choose a PDF workbook"}
              </strong>
              <small className="mt-1 block text-xs text-slate-500">
                PDF only · maximum 2 GB (chunked upload)
              </small>
            </span>
          </button>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="application/pdf,.pdf"
            onChange={e => onFile(e.target.files?.[0])}
          />
          <div className="flex items-center rounded-2xl bg-slate-50 px-4 text-sm text-slate-600">
            <FileUp className="mr-2 size-4 text-[#16849a]" />
            {pdfKey ? "PDF ready to publish" : "PDF required"}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            onClick={save}
            disabled={uploading || saving}
            className="rounded-full bg-[#10283f] px-6 hover:bg-[#174769]"
          >
            {saving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 size-4" />
            )}
            {editingId ? "Save changes" : "Publish book"}
          </Button>
          {!editingId && (
            <Button
              variant="ghost"
              onClick={reset}
              className="rounded-full text-slate-500"
            >
              Clear form
            </Button>
          )}
        </div>
      </div>
      <div className="p-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#10283f]">
            Published catalogue
          </h3>
          <span className="rounded-full bg-[#eaf6f8] px-3 py-1 text-xs font-bold text-[#16849a]">
            {products.data?.length ?? 0} books
          </span>
        </div>
        <div className="space-y-3">
          {products.data?.map(item => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <strong className="text-[#10283f]">{item.title}</strong>
                <p className="mt-1 text-xs text-slate-500">
                  {(item.priceCents / 100).toFixed(2)} {item.currency} ·{" "}
                  {item.status} · PDF secured
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => edit(item)}
                className="w-fit rounded-full"
              >
                <Pencil className="mr-2 size-3.5" />
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
