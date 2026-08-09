import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import UploadCard from "@/components/dashboard/upload-card";
import RecentDocuments from "@/components/dashboard/recent-documents";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-sm font-medium text-violet-600">Welcome back 👋</p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your AI Workspace</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Manage your documents, knowledge bases and AI conversations from one powerful workspace.
                  </p>
                </div>
                <a
                  href="/dashboard/chat"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:scale-[1.02] hover:shadow-violet-500/30"
                >
                  ✦ Open AI Chat
                </a>
              </div>
              <StatsCards />
              <div className="mt-8">
                <UploadCard />
              </div>
              <div className="mt-8">
                <RecentDocuments />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}