"use client";

import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

interface ReceiptUploadProps {
  reference: string;
  onSubmit: (file: { fileName: string; fileType: string; fileSizeBytes: number; dataUrl?: string; url?: string; storagePath?: string }) => Promise<void> | void;
}

export function ReceiptUpload({ reference, onSubmit }: ReceiptUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(selected: File | undefined) {
    if (!selected) return;
    if (selected.size > MAX_SIZE) {
      setError("File must be smaller than 5MB.");
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG, WEBP or PDF files are accepted.");
      return;
    }
    setError(null);
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!file || !preview) return;
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 20, 90));
    }, 150);
    try {
      const formData = new FormData();
      formData.append("kind", "receipt");
      formData.append("reference", reference);
      formData.append("file", file);
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      const upload = await response.json().catch(() => null);
      if (!response.ok || !upload?.ok || !upload?.path) {
        throw new Error(upload?.error || "Receipt upload failed.");
      }
      await onSubmit({
        fileName: file.name,
        fileType: file.type,
        fileSizeBytes: file.size,
        dataUrl: preview,
        url: upload?.url,
        storagePath: upload?.path,
      });
      setProgress(100);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  }

  return (
    <div>
      {!file ? (
        <label
          className="focus-ring flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-cream-soft/50 px-6 py-10 text-center hover:border-charcoal"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <UploadCloud className="h-8 w-8 text-body" aria-hidden="true" />
          <p className="text-sm font-semibold text-charcoal">Click to upload or drag your receipt here</p>
          <p className="text-xs text-body">JPG, PNG, WEBP or PDF — up to 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            {file.type === "application/pdf" ? (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream-soft">
                <FileText className="h-6 w-6 text-body" aria-hidden="true" />
              </span>
            ) : (
              preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Receipt preview" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              )
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-charcoal">{file.name}</p>
              <p className="text-xs text-body">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={removeFile} aria-label="Remove file" className="focus-ring shrink-0 text-body hover:text-error">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {uploading && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-soft">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm font-medium text-error">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      )}

      <Button className="mt-4 w-full" size="lg" disabled={!file || uploading} loading={uploading} onClick={handleSubmit}>
        Submit Receipt for Verification
      </Button>
    </div>
  );
}
