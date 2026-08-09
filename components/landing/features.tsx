import {
  BrainCircuit,
  Database,
  FileSearch,
  Workflow,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Chat",
    description:
      "Natural conversations powered by GPT, Claude and modern LLMs.",
  },
  {
    icon: Database,
    title: "Vector Database",
    description:
      "Semantic search with Pinecone, Qdrant or Supabase Vector.",
  },
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description:
      "Index PDFs, DOCX, Markdown and TXT files automatically.",
  },
  {
    icon: Workflow,
    title: "API Integration",
    description:
      "Connect any internal API or external SaaS in minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Private deployments with encrypted storage and secure access.",
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description:
      "Built with Next.js, TypeScript and scalable architecture.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            Everything Included
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Everything Needed
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              To Build AI
            </span>
          </h2>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-violet-500/40"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">

                  <Icon
                    size={30}
                    className="text-violet-400"
                  />

                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-400">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}