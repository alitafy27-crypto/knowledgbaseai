"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Database,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type KnowledgeBase = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  workspace_id: string;
  documents?: {
    id: string;
  }[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
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

export default function KnowledgePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<
    KnowledgeBase[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Load the knowledge bases belonging to
   * the currently authenticated user's workspace.
   */
  const loadKnowledgeBases = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setKnowledgeBases([]);
        setError("You are not signed in. Please log in again.");
        return;
      }

      const {
        data: workspace,
        error: workspaceError,
      } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (workspaceError) {
        throw workspaceError;
      }

      if (!workspace) {
        setKnowledgeBases([]);
        setError("No workspace was found for your account.");
        return;
      }

      const {
        data,
        error: queryError,
      } = await supabase
        .from("knowledge_bases")
        .select(
          `
            id,
            name,
            description,
            created_at,
            workspace_id,
            documents (
              id
            )
          `
        )
        .eq("workspace_id", workspace.id)
        .order("created_at", {
          ascending: false,
        });

      if (queryError) {
        throw queryError;
      }

      setKnowledgeBases(
        (data ?? []) as KnowledgeBase[]
      );
    } catch (err) {
      console.error("Failed to load knowledge bases:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load knowledge bases."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKnowledgeBases();
  }, [loadKnowledgeBases]);

  /**
   * Create a new knowledge base.
   */
  async function handleCreateKnowledgeBase() {
    if (creating) {
      return;
    }

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Please enter a knowledge base name.");
      return;
    }

    try {
      setCreating(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError("You must be signed in to create a knowledge base.");
        return;
      }

      const {
        data: workspace,
        error: workspaceError,
      } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (workspaceError) {
        throw workspaceError;
      }

      if (!workspace) {
        setError("No workspace was found for your account.");
        return;
      }

      const {
        error: insertError,
      } = await supabase
        .from("knowledge_bases")
        .insert({
          workspace_id: workspace.id,
          name: trimmedName,
          description: trimmedDescription || null,
          created_by: user.id,
        });

      if (insertError) {
        throw insertError;
      }

      setName("");
      setDescription("");
      setShowCreateForm(false);
      setSuccess("Knowledge base created successfully.");

      await loadKnowledgeBases();
    } catch (err) {
      console.error("Failed to create knowledge base:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create knowledge base."
      );
    } finally {
      setCreating(false);
    }
  }

  /**
   * Delete a knowledge base.
   */
  async function handleDeleteKnowledgeBase(
    knowledgeBaseId: string
  ) {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this knowledge base? All documents and chunks inside it will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(knowledgeBaseId);
      setError("");
      setSuccess("");

      const {
        error: deleteError,
      } = await supabase
        .from("knowledge_bases")
        .delete()
        .eq("id", knowledgeBaseId);

      if (deleteError) {
        throw deleteError;
      }

      setSuccess("Knowledge base deleted successfully.");
      await loadKnowledgeBases();
    } catch (err) {
      console.error("Failed to delete knowledge base:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete knowledge base."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>

                <span className="text-sm font-medium text-violet-600">
                  knowledg-base-ai Platform
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Knowledge Bases
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create knowledge bases and connect your documents so your AI assistant can search and understand them.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCreateForm((value) => !value);
                setError("");
                setSuccess("");
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:scale-[1.02] hover:shadow-violet-500/30"
            >
              <Plus className="h-4 w-4" />
              New Knowledge Base
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Create form */}
        {showCreateForm && (
          <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Create Knowledge Base
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Give your knowledge base a name and optional description.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="knowledge-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="knowledge-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Company Documentation"
                  disabled={creating}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="knowledge-description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <input
                  id="knowledge-description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this knowledge base about?"
                  disabled={creating}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setName("");
                  setDescription("");
                }}
                disabled={creating}
                className="h-10 rounded-xl border border-gray-300 px-5 text-sm font-medium text-slate-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateKnowledgeBase}
                disabled={creating}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* Knowledge bases */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
              Loading knowledge bases...
            </div>
          </div>
        ) : knowledgeBases.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
              <Database className="h-7 w-7 text-violet-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No knowledge bases yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first knowledge base to start uploading documents and powering your AI assistant.
            </p>

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:opacity-90 hover:shadow-violet-500/30"
            >
              <Plus className="h-4 w-4" />
              Create Knowledge Base
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {knowledgeBases.map((knowledgeBase) => {
              const documentCount = knowledgeBase.documents?.length ?? 0;

              return (
                <div
                  key={knowledgeBase.id}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
                      <Database className="h-5 w-5 text-violet-500" />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteKnowledgeBase(knowledgeBase.id)}
                      disabled={deletingId === knowledgeBase.id}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Delete knowledge base"
                    >
                      {deletingId === knowledgeBase.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <h2 className="mt-5 truncate text-lg font-semibold text-slate-900">
                    {knowledgeBase.name}
                  </h2>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                    {knowledgeBase.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span>
                        {documentCount} {documentCount === 1 ? "document" : "documents"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      href={`/dashboard/knowledge/${knowledgeBase.id}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-50 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/dashboard/knowledge/${knowledgeBase.id}/upload`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-sm font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:opacity-90 hover:shadow-violet-500/30"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}