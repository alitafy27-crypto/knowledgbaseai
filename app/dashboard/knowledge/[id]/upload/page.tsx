"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type SelectedFile = {
  file: File;
  id: string;
};

export default function UploadDocumentsPage() {
  const params = useParams();
  const router = useRouter();

  const knowledgeBaseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess("");

    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles: SelectedFile[] = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" is larger than 10 MB.`);
        continue;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(
          `"${file.name}" is not supported. Please upload PDF, TXT, or DOCX files.`
        );
        continue;
      }

      validFiles.push({
        file,
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      });
    }

    setFiles((current) => [...current, ...validFiles]);
    event.target.value = "";
  }

  function removeFile(id: string) {
    if (uploading) return;
    setFiles((current) => current.filter((item) => item.id !== id));
  }

  async function handleUpload() {
    if (uploading || files.length === 0 || !knowledgeBaseId) {
      if (!knowledgeBaseId) setError("Knowledge base ID is missing.");
      if (files.length === 0) setError("Please select at least one document.");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      let uploadedCount = 0;

      // نرسل كل ملف على حدة عبر الـ API
      for (const selected of files) {
        const formData = new FormData();
        formData.append("file", selected.file);
        formData.append("knowledgeBaseId", knowledgeBaseId);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Failed to upload ${selected.file.name}`);
        }

        uploadedCount += 1;
      }

      setFiles([]);
      setSuccess(
        `${uploadedCount} ${uploadedCount === 1 ? "document was" : "documents were"} uploaded successfully.`
      );

      setTimeout(() => {
        router.push(`/dashboard/knowledge/${knowledgeBaseId}`);
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Document upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload documents.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href={`/dashboard/knowledge/${knowledgeBaseId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Base
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-violet-300">knowledg-base-ai Platform</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Upload Documents</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Upload documents to add them to your knowledge base. Supported formats are PDF, TXT, and DOCX.
          </p>
        </header>

        {/* Error & Success */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Upload Card */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <label
            htmlFor="document-upload"
            className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center transition ${
              uploading ? "cursor-not-allowed opacity-60" : "hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
              <Upload className="h-7 w-7 text-violet-400" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">Choose your documents</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Select PDF, TXT, or DOCX files. Maximum file size is 10 MB per file.
            </p>
            <span className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">
              Browse Files
            </span>
            <input
              id="document-upload"
              type="file"
              multiple
              accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Selected Documents</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {files.length} {files.length === 1 ? "document" : "documents"} ready to upload.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {files.map((selected) => (
                  <div key={selected.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                        <FileText className="h-5 w-5 text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{selected.file.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{(selected.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(selected.id)}
                      disabled={uploading}
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href={`/dashboard/knowledge/${knowledgeBaseId}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? "Document" : "Documents"}` : "Documents"}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Pipeline info */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white">RAG Processing Pipeline</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold text-violet-400">01</div>
              <p className="mt-2 text-sm font-medium">Upload</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Store the original document.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold text-violet-400">02</div>
              <p className="mt-2 text-sm font-medium">Extract</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Extract readable text.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold text-violet-400">03</div>
              <p className="mt-2 text-sm font-medium">Chunk & Embed</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Create searchable vectors.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-semibold text-violet-400">04</div>
              <p className="mt-2 text-sm font-medium">AI Chat</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Ask questions about your data.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}