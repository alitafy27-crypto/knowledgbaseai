"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type KnowledgeBase = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

type DocumentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

type Document = {
  id: string;
  name: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

function formatFileSize(size: number | null) {
  if (!size || size <= 0) {
    return "Unknown size";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(
    size /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function getStatusIcon(
  status: DocumentStatus
) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      );

    case "processing":
      return (
        <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
      );

    case "failed":
      return (
        <XCircle className="h-4 w-4 text-red-400" />
      );

    default:
      return (
        <Clock3 className="h-4 w-4 text-amber-400" />
      );
  }
}

function getStatusLabel(
  status: DocumentStatus
) {
  switch (status) {
    case "completed":
      return "Completed";

    case "processing":
      return "Processing";

    case "failed":
      return "Failed";

    default:
      return "Pending";
  }
}

function getStatusClass(
  status: DocumentStatus
) {
  switch (status) {
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    case "processing":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";

    case "failed":
      return "border-red-500/20 bg-red-500/10 text-red-300";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
}

export default function KnowledgeBasePage() {
  const params = useParams();

  const knowledgeBaseId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [knowledgeBase, setKnowledgeBase] =
    useState<KnowledgeBase | null>(null);

  const [documents, setDocuments] =
    useState<Document[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadData = useCallback(
    async (showRefreshState = false) => {
      if (!knowledgeBaseId) {
        setError("Knowledge base ID is missing.");
        setLoading(false);
        return;
      }

      try {
        if (showRefreshState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");
        setSuccess("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setKnowledgeBase(null);
          setDocuments([]);
          setError(
            "You must be signed in to view this knowledge base."
          );
          return;
        }

        const {
          data: knowledgeBaseData,
          error: knowledgeBaseError,
        } = await supabase
          .from("knowledge_bases")
          .select(
            `
              id,
              name,
              description,
              created_at
            `
          )
          .eq("id", knowledgeBaseId)
          .maybeSingle();

        if (knowledgeBaseError) {
          throw knowledgeBaseError;
        }

        if (!knowledgeBaseData) {
          setKnowledgeBase(null);
          setDocuments([]);
          setError("Knowledge base not found.");
          return;
        }

        setKnowledgeBase(
          knowledgeBaseData as KnowledgeBase
        );

        const {
          data: documentsData,
          error: documentsError,
        } = await supabase
          .from("documents")
          .select(
            `
              id,
              name,
              file_name,
              file_type,
              file_size,
              status,
              error_message,
              created_at
            `
          )
          .eq(
            "knowledge_base_id",
            knowledgeBaseId
          )
          .order("created_at", {
            ascending: false,
          });

        if (documentsError) {
          throw documentsError;
        }

        setDocuments(
          (documentsData ?? []) as Document[]
        );
      } catch (err) {
        console.error(
          "Failed to load knowledge base:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load knowledge base."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [knowledgeBaseId]
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleDeleteDocument(
    documentId: string
  ) {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");
      setSuccess("");

      const {
        data: document,
        error: documentError,
      } = await supabase
        .from("documents")
        .select("id, file_path")
        .eq("id", documentId)
        .maybeSingle();

      if (documentError) {
        throw documentError;
      }

      /*
       * Delete the database record.
       *
       * Storage cleanup will be handled later
       * when we build the complete upload/storage API.
       */
      const {
        error: deleteError,
      } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (deleteError) {
        throw deleteError;
      }

      void document;

      setDocuments((current) =>
        current.filter(
          (item) => item.id !== documentId
        )
      );

      setSuccess(
        "Document deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete document:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const completedCount = documents.filter(
    (document) =>
      document.status === "completed"
  ).length;

  const processingCount = documents.filter(
    (document) =>
      document.status === "processing"
  ).length;

  const failedCount = documents.filter(
    (document) =>
      document.status === "failed"
  ).length;

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
            Loading knowledge base...
          </div>
        </div>
      </main>
    );
  }

  if (!knowledgeBase) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Database className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="mt-5 text-xl font-semibold">
              Knowledge base not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "This knowledge base does not exist or you do not have access to it."}
            </p>

            <Link
              href="/dashboard/knowledge"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Bases
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[5%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute bottom-[-10%] right-[5%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/dashboard/knowledge"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Bases
          </Link>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>

                <span className="text-sm font-medium text-violet-300">
                  Knowledge Base
                </span>
              </div>

              <h1 className="truncate text-3xl font-bold tracking-tight sm:text-4xl">
                {knowledgeBase.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {knowledgeBase.description ||
                  "Manage the documents connected to this AI knowledge base."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  void loadData(true)
                }
                disabled={refreshing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>

              <Link
                href={`/dashboard/knowledge/${knowledgeBase.id}/upload`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
              >
                <Upload className="h-4 w-4" />
                Upload Documents
              </Link>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-300/70 transition hover:text-red-200"
            >
              ×
            </button>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Total documents
              </p>

              <FileText className="h-5 w-5 text-violet-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {documents.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Completed
              </p>

              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Processing
              </p>

              <Clock3 className="h-5 w-5 text-amber-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {processingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Failed
              </p>

              <XCircle className="h-5 w-5 text-red-400" />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {failedCount}
            </p>
          </div>
        </section>

        {/* Documents */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Database className="h-5 w-5 text-cyan-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Documents
                </h2>

                <p className="text-sm text-slate-500">
                  Files connected to this knowledge base.
                </p>
              </div>
            </div>

            <Link
              href={`/dashboard/knowledge/${knowledgeBase.id}/upload`}
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-cyan-400"
            >
              <Upload className="h-4 w-4" />
              Add documents
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                <FileText className="h-7 w-7 text-violet-400" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No documents yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload your first document. The RAG
                pipeline will later extract its content,
                create chunks, generate embeddings, and
                make it searchable by the AI.
              </p>

              <Link
                href={`/dashboard/knowledge/${knowledgeBase.id}/upload`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Upload className="h-4 w-4" />
                Upload First Document
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {document.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="truncate">
                          {document.file_name}
                        </span>

                        <span>
                          {formatFileSize(
                            document.file_size
                          )}
                        </span>

                        <span>
                          {formatDate(
                            document.created_at
                          )}
                        </span>
                      </div>

                      {document.error_message && (
                        <p className="mt-2 text-xs text-red-400">
                          {document.error_message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClass(
                        document.status
                      )}`}
                    >
                      {getStatusIcon(
                        document.status
                      )}

                      {getStatusLabel(
                        document.status
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDeleteDocument(
                          document.id
                        )
                      }
                      disabled={
                        deletingId ===
                        document.id
                      }
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete ${document.name}`}
                    >
                      {deletingId ===
                      document.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}