import Link from "next/link";

const documents = [
  {
    name: "Company Handbook.pdf",
    size: "2.4 MB",
    updated: "Updated Today",
    type: "PDF",
  },
  {
    name: "Pricing Guide.pdf",
    size: "1.1 MB",
    updated: "Updated Yesterday",
    type: "PDF",
  },
  {
    name: "Employee Policy.docx",
    size: "840 KB",
    updated: "Updated 2 days ago",
    type: "DOCX",
  },
  {
    name: "Product Documentation.md",
    size: "320 KB",
    updated: "Updated 4 days ago",
    type: "MD",
  },
];

export default function RecentDocuments() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Documents
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your latest indexed knowledge
          </p>
        </div>

        <Link
          href="/dashboard/knowledge"
          className="text-xs font-semibold text-violet-600 transition hover:text-violet-500"
        >
          View all
        </Link>
      </div>

      <div>
        {documents.map((document, index) => (
          <div
            key={document.name}
            className={`flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50 ${
              index !== documents.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[9px] font-bold ${
                document.type === "PDF"
                  ? "border-orange-200 bg-orange-50 text-orange-600"
                  : document.type === "DOCX"
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-violet-200 bg-violet-50 text-violet-600"
              }`}
            >
              {document.type}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">
                {document.name}
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                {document.size} · {document.updated}
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-medium text-emerald-600">
                Indexed
              </span>
            </div>

            <button
              type="button"
              aria-label={`More options for ${document.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-gray-100 hover:text-slate-900"
            >
              •••
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}