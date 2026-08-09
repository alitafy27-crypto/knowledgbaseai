"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Database,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0b1225] to-[#071c2f]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#5b5bd633,transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d433,transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-28">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              <Sparkles size={16} />
              Enterprise your saas Platform
            </div>

            <h1 className="mt-8 text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Build Powerful
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI Knowledge
              </span>
              <br />
              Assistants
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-slate-300">
              Create enterprise-grade AI assistants powered by Retrieval
              Augmented Generation. Chat with documents, search millions of
              records instantly and deliver accurate AI answers backed by your
              own knowledge base.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/dashboard"
                className="rounded-xl bg-violet-600 px-7 py-4 font-semibold text-white transition hover:bg-violet-500 inline-flex items-center gap-2"
              >
                Start Free
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#demo"
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-7 py-4 font-semibold text-white transition hover:border-violet-500"
              >
                Live Demo
              </Link>

            </div>

            {/* Stats */}

            <div className="mt-14 grid grid-cols-3 gap-8">

              <div>
                <h3 className="text-4xl font-bold text-white">
                  99.99%
                </h3>

                <p className="mt-2 text-slate-400">
                  Uptime
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-white">
                  50M+
                </h3>

                <p className="mt-2 text-slate-400">
                  Documents
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-white">
                  &lt;1s
                </h3>

                <p className="mt-2 text-slate-400">
                  AI Response
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)]">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-400">
                    AI Assistant
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-white">
                    Company Knowledge Base
                  </h2>

                </div>

                <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse" />

              </div>

              <div className="mt-10 space-y-4">

                <FeatureCard
                  icon={<BrainCircuit className="text-violet-400" />}
                  title="GPT Powered Chat"
                  text="Ask natural language questions across every document."
                />

                <FeatureCard
                  icon={<Database className="text-cyan-400" />}
                  title="Vector Search"
                  text="Semantic search with enterprise-scale indexing."
                />

                <FeatureCard
                  icon={<FileText className="text-orange-400" />}
                  title="Document Processing"
                  text="Upload PDF, DOCX, TXT and Markdown files."
                />

                <FeatureCard
                  icon={<ShieldCheck className="text-green-400" />}
                  title="Enterprise Security"
                  text="Private deployment with encrypted storage."
                />

              </div>

              <div className="mt-8 rounded-2xl bg-slate-950/60 p-5">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    className="text-green-400"
                    size={18}
                  />

                  <span className="text-sm text-green-400 font-medium">
                    AI Response Ready
                  </span>

                </div>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  According to your internal knowledge base, employees can
                  securely upload documents, search company data and receive
                  contextual GPT responses in under one second.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function FeatureCard({ icon, title, text }: FeatureProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-violet-500/40 hover:bg-slate-900">

      <div>{icon}</div>

      <div>

        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {text}
        </p>

      </div>

    </div>
  );
}