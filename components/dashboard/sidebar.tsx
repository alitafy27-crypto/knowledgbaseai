"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "⌂" },
  { name: "AI Chat", href: "/dashboard/chat", icon: "✦" },
  { name: "Knowledge Base", href: "/dashboard/knowledge", icon: "▣" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-gray-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          {/* تم استبدال الأيقونة القديمة بالشعار الجديد */}
          <img 
            src="/logo.png" 
            alt="knowledgbaseai Logo" 
            className="h-10 w-10 object-contain" 
          />
          <div>
            <div className="text-sm font-bold text-slate-900">knowledgbaseai</div>
            <div className="text-[10px] text-slate-500">Knowledge Platform</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6">
        <p className="mb-4 px-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700 shadow-sm"
                    : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                    active
                      ? "bg-violet-100 text-violet-600"
                      : "bg-gray-100 text-slate-500 group-hover:text-slate-700"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Workspace plan */}
      <div className="border-t border-gray-200 p-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">N</div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900">Personal Workspace</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Free Plan</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Storage</span>
              <span className="text-slate-600">0.8 / 5 GB</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-[16%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
            </div>
          </div>
          <Link
            href="#"
            className="mt-4 flex h-9 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </aside>
  );
}