"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

const stats = [
  {
    label: "Documents",
    value: "0",
    description: "Documents in your workspace",
    icon: FileText,
  },
  {
    label: "Knowledge Bases",
    value: "0",
    description: "Active knowledge bases",
    icon: Database,
  },
  {
    label: "AI Questions",
    value: "0",
    description: "Questions answered",
    icon: MessageSquare,
  },
  {
    label: "Searches",
    value: "0",
    description: "Semantic searches",
    icon: Search,
  },
];

const quickActions = [
  {
    title: "Upload documents",
    description:
      "Add PDFs, DOCX, TXT and other supported files to your knowledge base.",
    href: "/dashboard/knowledge",
    icon: Upload,
  },
  {
    title: "Create knowledge base",
    description:
      "Organize your company documents into a dedicated AI knowledge base.",
    href: "/dashboard/knowledge",
    icon: Database,
  },
  {
    title: "Ask AI",
    description:
      "Ask questions and get answers based on your connected documents.",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
];

export default function DashboardPage() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>

            <span className="text-sm font-medium text-violet-600">
              your saas Platform
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your knowledge bases and build intelligent AI
            assistants.
          </p>
        </div>

        <Link
          href="/dashboard/knowledge"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:scale-[1.02] hover:shadow-violet-500/30"
        >
          <Plus className="h-4 w-4" />
          New Knowledge Base
        </Link>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:border-violet-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  <Icon className="h-5 w-5 text-violet-500" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Main grid */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Knowledge workspace */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-600" />

                <h2 className="text-lg font-semibold text-slate-900">
                  Knowledge Bases
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Your AI knowledge sources will appear here.
              </p>
            </div>

            <Link
              href="/dashboard/knowledge"
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition hover:text-cyan-600"
            >
              Manage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Empty state */}
          <div className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50">
              <Database className="h-7 w-7 text-violet-500" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No knowledge bases yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first knowledge base and upload documents
              that your AI assistant can understand and search.
            </p>

            <Link
              href="/dashboard/knowledge"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50 hover:text-violet-600"
            >
              <Plus className="h-4 w-4" />
              Create Knowledge Base
            </Link>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-violet-50 to-cyan-50 p-6 shadow-sm">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  AI Assistant
                </h2>

                <p className="text-xs text-slate-500">
                  RAG-powered conversations
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-1 flex-col">
              <div className="rounded-xl border border-gray-200 bg-white/50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Ready
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Connect a knowledge base to start asking questions
                  about your documents.
                </p>
              </div>

              <Link
                href="/dashboard/chat"
                className="mt-auto flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50 hover:text-violet-600"
              >
                Open AI Assistant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Start building your AI knowledge system.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                  <Icon className="h-5 w-5 text-violet-500 transition group-hover:text-cyan-500" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-violet-600 transition group-hover:text-cyan-600">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Analytics preview */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
            <BarChart3 className="h-5 w-5 text-cyan-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Usage & Analytics
            </h2>

            <p className="text-sm text-slate-500">
              Track your AI usage and knowledge activity.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs text-slate-500">
              Questions this month
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs text-slate-500">
              Documents processed
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <p className="text-xs text-slate-500">
              Storage used
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              0 MB
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}