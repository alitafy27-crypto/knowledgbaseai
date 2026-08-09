"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ACCEPTED_TYPES = [
  ".pdf",
  ".docx",
  ".txt",
  ".md",
];

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const validateFile = (file: File) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!ACCEPTED_TYPES.includes(extension)) {
      setError("Unsupported file type. Use PDF, DOCX, TXT or Markdown.");
      return false;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 20 MB.");
      return false;
    }

    setError("");
    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setUploading(true);
    setError("");

    // Temporary upload simulation.
    // Later this will connect to /api/documents/upload.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setUploadedFile(file);
    setUploading(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void processFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void processFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError("");
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-600">
            <Upload size={19} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Add knowledge to your workspace
            </h2>

            <p className="text-sm text-slate-500">
              Upload documents and turn them into searchable AI knowledge.
            </p>
          </div>
        </div>
      </div>

      {uploadedFile ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FileText size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {uploadedFile.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />

              <button
                type="button"
                onClick={removeFile}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-gray-100 hover:text-slate-900"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-violet-400 bg-violet-50"
              : "border-gray-300 bg-gray-50/50 hover:border-violet-400 hover:bg-violet-50/30"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-600">
            {uploading ? (
              <Loader2
                size={24}
                className="animate-spin"
              />
            ) : (
              <Upload size={24} />
            )}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            {uploading
              ? "Processing document..."
              : "Drop your document here"}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            or choose a file from your computer
          </p>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:scale-[1.02] hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Document
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {["PDF", "DOCX", "TXT", "MD"].map((type) => (
              <span
                key={type}
                className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500 shadow-sm"
              >
                {type}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Maximum file size: 20 MB
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 p-3">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-xs leading-5 text-red-600">
            {error}
          </p>
        </div>
      )}
    </section>
  );
}