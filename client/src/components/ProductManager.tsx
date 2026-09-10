import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProductManager() {
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [price, setPrice] = useState(""); const [pdfKey, setPdfKey] = useState("");
  const upload = trpc.digitalProducts.adminUploadPdf.useMutation({ onSuccess: data => { setPdfKey(data.key); toast.success("PDF uploaded securely"); }, onError: e => toast.error(e.message) });
  const create = trpc.digitalProducts.adminCreate.useMutation({ onSuccess: () => { setTitle(""); setDescription(""); setPrice(""); setPdfKey(""); toast.success("Book added"); }, onError: e => toast.error(e.message) });
  const onFile = (file?: File) => { if (!file) return; if (file.type !== "application/pdf") return toast.error("Choose a PDF file"); const reader = new FileReader(); reader.onload = () => upload.mutate({ fileName: file.name, base64: String(reader.result) }); reader.readAsDataURL(file); };
  return <section className="mb-7 rounded-[2rem] bg-white p-7 shadow-[0_18px_60px_rgba(40,59,37,.10)]"><p className="text-xs font-bold tracking-[.18em] text-[#89966d]">PRIVATE PRODUCT MANAGER</p><h2 className="mt-2 font-display text-3xl font-bold">Add a book</h2><div className="mt-5 grid gap-3 md:grid-cols-2"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" /><Input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price in USD, e.g. 9.99" inputMode="decimal" /><Textarea className="md:col-span-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} /><Input type="file" accept="application/pdf" onChange={e => onFile(e.target.files?.[0])} /><span className="self-center text-sm text-[#667064]">{pdfKey ? "PDF ready" : "PDF required"}</span></div><Button className="mt-4 rounded-full bg-[#283b25]" disabled={!title || !description || !price || !pdfKey || create.isPending} onClick={() => create.mutate({ title, description, priceCents: Math.round(Number(price) * 100), currency: "USD", pdfKey, status: "published" })}>Add published book</Button></section>;
}
