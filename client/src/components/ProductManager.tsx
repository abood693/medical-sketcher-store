import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProductManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pdfKey, setPdfKey] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const products = trpc.digitalProducts.adminList.useQuery();
  const utils = trpc.useUtils();
  const upload = trpc.digitalProducts.adminUploadPdf.useMutation({
    onSuccess: data => {
      setPdfKey(data.key);
      toast.success("PDF uploaded securely");
    },
    onError: e => toast.error(e.message),
  });
  const reset = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setPdfKey("");
    setEditingId(null);
  };
  const create = trpc.digitalProducts.adminCreate.useMutation({
    onSuccess: () => {
      reset();
      utils.digitalProducts.adminList.invalidate();
      toast.success("Book added");
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
  const onFile = (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf")
      return toast.error("Choose a PDF file");
    const reader = new FileReader();
    reader.onload = () =>
      upload.mutate({ fileName: file.name, base64: String(reader.result) });
    reader.readAsDataURL(file);
  };
  const edit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setPrice(String(item.priceCents / 100));
    setPdfKey(item.pdfKey);
  };
  const save = () => {
    const input = {
      title,
      description,
      priceCents: Math.round(Number(price) * 100),
      currency: "JOD" as const,
      pdfKey,
      status: "published" as const,
    };
    if (editingId) update.mutate({ ...input, id: editingId });
    else create.mutate(input);
  };
  return (
    <section className="mb-7 rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]">
      <p className="text-xs font-bold tracking-[.18em] text-[#89966d]">
        PRIVATE PRODUCT MANAGER
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold">
        {editingId ? "Edit book" : "Add a book"}
      </h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Book title"
        />
        <Input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Price in JOD, e.g. 5"
          inputMode="decimal"
        />
        <Textarea
          className="md:col-span-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Book description"
          rows={3}
        />
        <Input
          type="file"
          accept="application/pdf"
          onChange={e => onFile(e.target.files?.[0])}
        />
        <span className="self-center text-sm text-[#667064]">
          {pdfKey ? "PDF ready" : "PDF required"}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          className="rounded-full bg-[#283b25]"
          disabled={
            !title ||
            !description ||
            !price ||
            !pdfKey ||
            create.isPending ||
            update.isPending
          }
          onClick={save}
        >
          {editingId ? "Save changes" : "Add published book"}
        </Button>
        {editingId && (
          <Button variant="outline" onClick={reset}>
            Cancel
          </Button>
        )}
      </div>
      <div className="mt-7 space-y-2">
        {products.data?.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#f4f1e9] p-4"
          >
            <div>
              <strong>{item.title}</strong>
              <p className="text-xs text-[#667064]">
                {(item.priceCents / 100).toFixed(2)} {item.currency} ·{" "}
                {item.status}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => edit(item)}>
              Edit
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
