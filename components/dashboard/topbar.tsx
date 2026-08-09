"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">AI Workspace</h2>
        <p className="mt-0.5 text-[10px] text-slate-500">Manage your knowledge and AI assistants</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/chat"
          className="hidden h-9 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 text-xs font-medium text-slate-700 transition hover:bg-gray-100 sm:flex"
        >
          <span>✦</span>
          Ask AI
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-slate-500 transition hover:text-slate-900"
        >
          ♢
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500" />
        </button>
        <button
          type="button"
          aria-label="Account"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white"
        >
          A
        </button>
      </div>
    </header>
  );
}