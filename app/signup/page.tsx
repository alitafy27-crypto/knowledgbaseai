"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!supabaseUrl || !supabasePublishableKey) {
      setError(
        "Supabase configuration is missing. Check your .env.local file.",
      );
      return;
    }

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setError(
        "Please enter your email address.",
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient(
        supabaseUrl,
        supabasePublishableKey,
      );

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (signupError) {
        throw signupError;
      }

      if (!data.user) {
        throw new Error(
          "Account could not be created. Please try again.",
        );
      }

      /*
       * Supabase account created successfully.
       *
       * If email confirmation is enabled,
       * Supabase returns no active session.
       */
      if (!data.session) {
        setSuccess(
          "Your account has been created. Please check your email to confirm your account.",
        );

        setPassword("");
        setConfirmPassword("");

        return;
      }

      /*
       * Email confirmation is disabled.
       * The user already has an active session.
       */
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(
        "Signup error:",
        err,
      );

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your account.";

      const normalizedMessage =
        message.toLowerCase();

      if (
        normalizedMessage.includes(
          "user already registered",
        ) ||
        normalizedMessage.includes(
          "already registered",
        )
      ) {
        setError(
          "An account with this email already exists. Please sign in.",
        );
      } else if (
        normalizedMessage.includes(
          "invalid email",
        )
      ) {
        setError(
          "Please enter a valid email address.",
        );
      } else if (
        normalizedMessage.includes(
          "password",
        )
      ) {
        setError(message);
      } else if (
        normalizedMessage.includes(
          "fetch",
        ) ||
        normalizedMessage.includes(
          "network",
        )
      ) {
        setError(
          "Unable to connect to Supabase. Please check your Supabase URL, publishable key, and internet connection.",
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050713] px-4 py-10 text-white">
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
                your saas
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
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Start building your AI knowledge workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{success}</span>
            </div>
          )}

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >
            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(
                      event.target.value,
                    )
                  }
                  placeholder="your saas User"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#070a15] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

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
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#070a15] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="At least 8 characters"
                  disabled={loading}
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

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Repeat your password"
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#070a15] pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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

                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-violet-400 transition hover:text-cyan-400"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-5 text-center text-xs leading-5 text-slate-600">
          By creating an account, you agree to our{" "}

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