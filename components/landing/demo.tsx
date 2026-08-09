import {
  Bot,
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Demo() {
  return (
    <section id="demo" className="py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            Live Demo
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Chat With Your Knowledge Base
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            Upload documents and ask questions. AI retrieves the most relevant
            information before generating accurate answers.
          </p>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-xl">

            <div className="flex items-center gap-3">
              <Bot className="text-violet-400" />
              <h3 className="text-2xl font-bold text-white">
                AI Assistant
              </h3>
            </div>

            <div className="mt-8 space-y-5">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  User
                </p>

                <p className="mt-2 text-white">
                  What is our refund policy?
                </p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">

                <p className="text-sm text-violet-300">
                  AI Answer
                </p>

                <p className="mt-3 leading-8 text-slate-300">
                  Customers can request a refund within 30 days provided the
                  product hasn't been substantially used.
                </p>

                <div className="mt-5 flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={18} />
                  refund-policy.pdf
                </div>

              </div>

            </div>

          </div>

          <div className="space-y-6">

            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">

              <div className="flex items-center gap-3">
                <FileText className="text-cyan-400" />
                <h3 className="font-bold text-white">
                  Indexed Documents
                </h3>
              </div>

              <div className="mt-6 space-y-3">

                {[
                  "Company Handbook.pdf",
                  "Pricing Guide.pdf",
                  "Employee Policy.pdf",
                  "Support FAQ.docx",
                ].map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3"
                  >
                    <span>{file}</span>
                    <CheckCircle2 className="text-green-400" size={18} />
                  </div>
                ))}

              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600 to-cyan-500 p-6">

              <div className="flex items-center gap-3">
                <Search />
                <Sparkles />
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                GPT + RAG + Vector Search
              </h3>

              <p className="mt-3 text-white/90">
                Enterprise Retrieval-Augmented Generation architecture.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}