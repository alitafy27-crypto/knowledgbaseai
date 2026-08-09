import {
  Upload,
  Database,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    text: "Import PDFs, DOCX, Markdown, TXT or connect APIs.",
  },
  {
    icon: Database,
    title: "Generate Embeddings",
    text: "Automatically split, embed and store your knowledge.",
  },
  {
    icon: BrainCircuit,
    title: "AI Retrieval",
    text: "Retrieve the most relevant context before every answer.",
  },
  {
    icon: MessageSquare,
    title: "Chat Instantly",
    text: "Receive accurate answers backed by your own data.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            Workflow
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            How It Works
          </h2>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl border border-white/10 bg-slate-900/40 p-8 transition hover:-translate-y-2 hover:border-cyan-500/40"
              >
                <span className="absolute right-6 top-6 text-6xl font-extrabold text-white/5">
                  0{index + 1}
                </span>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">

                  <Icon
                    size={30}
                    className="text-cyan-400"
                  />

                </div>

                <h3 className="mt-8 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-400">
                  {step.text}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}