import Sidebar from "../../components/dashboard/sidebar";
import Topbar from "../../components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // تم تغيير الخلفية إلى الأبيض (bg-white) والنصوص إلى الداكن (text-slate-900)
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gray-50/50"> {/* خلفية المنطقة الرئيسية رمادية فاتحة جداً لتمييزها */}
        <Topbar />
        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}