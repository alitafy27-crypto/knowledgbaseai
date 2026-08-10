"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error(
          "Login failed. Please check your email and password.",
        );
      }

      if (!data.session) {
        throw new Error(
          "No active session was created. Please try again.",
        );
      }

      /*
       * The login was successful.
       *
       * The Supabase browser client stores the session.
       * We then navigate to the dashboard.
       *
       * router.replace() prevents the user from going
       * back to the login page with the browser Back button.
       */
      router.replace("/dashboard");

      /*
       * Refresh the Next.js server components so that
       * middleware/server-side Supabase authentication
       * can immediately recognize the new session.
       */
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing in.";

      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes(
          "invalid login credentials",
        )
      ) {
        setError(
          "Invalid email or password. Please check your credentials and try again.",
        );
      } else if (
        normalizedMessage.includes(
          "email not confirmed",
        )
      ) {
        setError(
          "Please confirm your email address before signing in.",
        );
      } else if (
        normalizedMessage.includes(
          "too many requests",
        )
      ) {
        setError(
          "Too many login attempts. Please wait a moment and try again.",
        );
      } else {
        setError(message);
      }

      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 py-10 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link
            href="/"
            className="group mb-4 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-cyan-400 shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>

            <div>
              <div className="text-left text-lg font-bold tracking-tight">
                knowledg-base-ai
              </div>

              <div className="text-left text-xs text-slate-500">
                Knowledge Platform
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0a0d1c]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to your AI knowledge workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#070a15] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-violet-400 transition hover:text-cyan-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Your password"
                  disabled={loading}
                  required
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#070a15] pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Signup */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-violet-400 transition hover:text-cyan-400"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-600">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="transition hover:text-slate-400"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="transition hover:text-slate-400"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}