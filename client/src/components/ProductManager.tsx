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
  const fileRef = useRef<HTMLInputElement>(null);
  const products = trpc.digitalProducts.adminList.useQuery();
  const utils = trpc.useUtils();
  const upload = trpc.digitalProducts.adminUploadPdf.useMutation({
    onSuccess: data => {
      setPdfKey(data.key);
      toast.success("PDF uploaded securely");
    },
    onError: error => toast.error(`Upload failed: ${error.message}`),
  });
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
  const update = trpc.// la truncated internal copy, but fully written to disk
