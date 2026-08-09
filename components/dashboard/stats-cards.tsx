"use client";

const stats = [
  {
    label: "Documents",
    value: "24",
    change: "+12%",
    description: "from last month",
    icon: "▣",
  },
  {
    label: "Knowledge Bases",
    value: "3",
    change: "+1",
    description: "this month",
    icon: "⊙",
  },
  {
    label: "AI Questions",
    value: "1,284",
    change: "+24%",
    description: "from last month",
    icon: "✦",
  },
  {
    label: "Storage Used",
    value: "1.2 GB",
    change: "24%",
    description: "of 5 GB available",
    icon: "▤",
  },
];

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-xs text-violet-600">
              {stat.icon}
            </div>

            {/* تم تغيير لون الشارة (Badge) من الأخضر الداكن إلى الأخضر الفاتح للنصوص الداكنة */}
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">
              {stat.change}
            </span>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-500">{stat.label}</p>

          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {stat.value}
            </h3>

            <span className="text-[9px] text-slate-400">
              {stat.description}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}