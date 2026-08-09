"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Source {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  similarity: number;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * AUTH CHECK
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (!session) {
          router.replace("/login?next=/dashboard/chat");
          return;
        }

        setCheckingAuth(false);
      } catch (err) {
        console.error(
          "Authentication check failed:",
          err,
        );

        if (mounted) {
          router.replace("/login?next=/dashboard/chat");
        }
      }
    }

    checkAuthentication();

    /*
     * Listen for authentication changes.
     *
     * This is important because Supabase can refresh
     * the session automatically.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) {
          return;
        }

        if (
          event === "SIGNED_OUT" ||
          !session
        ) {
          router.replace(
            "/login?next=/dashboard/chat",
          );

          return;
        }

        setCheckingAuth(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  /*
   * ---------------------------------------------------------
   * ASK AI
   * ---------------------------------------------------------
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      loading ||
      checkingAuth
    ) {
      return;
    }

    setError("");

    /*
     * Get the current authenticated session.
     */
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error(
        "Session error:",
        sessionError,
      );

      setError(
        "Unable to verify your session. Please sign in again.",
      );

      router.replace(
        "/login?next=/dashboard/chat",
      );

      return;
    }

    if (!session?.access_token) {
      setError(
        "Your session has expired. Please sign in again.",
      );

      router.replace(
        "/login?next=/dashboard/chat",
      );

      return;
    }

    /*
     * Get the active workspace.
     */
    const workspaceId =
      localStorage.getItem(
        "activeWorkspaceId",
      );

    if (!workspaceId) {
      setError(
        "No active workspace was found. Please open your workspace first.",
      );

      return;
    }

    /*
     * Add user's message immediately.
     */
    const userMessage: Message = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/ask",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            question: trimmedQuestion,
            workspaceId,
          }),
        },
      );

      /*
       * Try to parse the response safely.
       */
      let data: {
        answer?: string;
        sources?: Source[];
        error?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /*
       * Unauthorized.
       */
      if (response.status === 401) {
        setError(
          "Your session has expired. Please sign in again.",
        );

        await supabase.auth.signOut();

        router.replace(
          "/login?next=/dashboard/chat",
        );

        return;
      }

      /*
       * Other API errors.
       */
      if (!response.ok) {
        throw new Error(
          data.error ??
            "Failed to generate an answer.",
        );
      }

      /*
       * Assistant response.
       */
      const assistantMessage: Message = {
        role: "assistant",

        content:
          data.answer ??
          "I couldn't generate an answer.",

        sources:
          data.sources ?? [],
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      console.error(
        "Chat error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the answer.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * LOADING AUTH
   * ---------------------------------------------------------
   */

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />

            <span>
              Checking your session...
            </span>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                AI Chat
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Ask questions about your
                knowledge base.
              </p>
            </div>

            <div className="hidden rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:block">
              AI Knowledge Assistant
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6">
          {messages.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border bg-muted text-2xl">
                  ✨
                </div>

                <h2 className="text-xl font-semibold">
                  Ask your knowledge base
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Upload documents to your
                  knowledge base, then ask
                  questions about their
                  contents.
                </p>
              </div>
            </div>
          )}

          {messages.map(
            (message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-primary-foreground"
                      : "max-w-[90%] rounded-2xl rounded-bl-md border bg-card px-4 py-4 text-sm shadow-sm"
                  }
                >
                  <div className="whitespace-pre-wrap leading-6">
                    {message.content}
                  </div>

                  {/* Sources */}
                  {message.role ===
                    "assistant" &&
                    message.sources &&
                    message.sources
                      .length > 0 && (
                      <div className="mt-5 border-t pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Sources
                        </p>

                        <div className="space-y-3">
                          {message.sources
                            .slice(0, 5)
                            .map(
                              (
                                source,
                                sourceIndex,
                              ) => (
                                <div
                                  key={
                                    source.chunkId
                                  }
                                  className="rounded-lg border bg-muted/40 p-3"
                                >
                                  <div className="mb-1 flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium">
                                      Source{" "}
                                      {sourceIndex +
                                        1}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                      {(
                                        source.similarity *
                                        100
                                      ).toFixed(
                                        1,
                                      )}
                                      %
                                    </span>
                                  </div>

                                  <p className="line-clamp-4 text-xs leading-5 text-muted-foreground">
                                    {
                                      source.content
                                    }
                                  </p>
                                </div>
                              ),
                            )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ),
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border bg-card px-4 py-3 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-current" />

                  <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:150ms]" />

                  <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:300ms]" />

                  <span className="ml-1 text-muted-foreground">
                    Searching your
                    knowledge base...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-0 mt-8 border-t bg-background pt-4"
        >
          <div className="flex items-end gap-3 rounded-2xl border bg-card p-2 shadow-sm">
            <textarea
              value={question}
              onChange={(event) =>
                setQuestion(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  if (!loading) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }
              }}
              placeholder="Ask a question about your documents..."
              rows={2}
              disabled={loading}
              className="min-h-[56px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !question.trim()
              }
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Ask"}
            </button>
          </div>

          <p className="mt-2 px-2 text-xs text-muted-foreground">
            Press Enter to send · Shift +
            Enter for a new line
          </p>
        </form>
      </div>
    </main>
  );
}