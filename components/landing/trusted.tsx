import {
  BrainCircuit,
  Database,
  ShieldCheck,
  Cloud,
  Cpu,
  Network,
} from "lucide-react";

const companies = [
  {
    icon: BrainCircuit,
    name: "OpenAI",
  },
  {
    icon: Database,
    name: "Pinecone",
  },
  {
    icon: Network,
    name: "LangChain",
  },
  {
    icon: Cloud,
    name: "Supabase",
  },
  {
    icon: Cpu,
    name: "Anthropic",
  },
  {
    icon: ShieldCheck,
    name: "Azure AI",
  },
];

export default function Trusted() {
  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
            Powered By Modern AI Technologies
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white">
            Built Using Industry Leaders
          </h2>

        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {companies.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.name}
                className="group rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/40 hover:bg-slate-900"
              >
                <div className="flex justify-center">

                  <Icon
                    size={34}
                    className="text-violet-400 transition group-hover:scale-110"
                  />

                </div>

                <h3 className="mt-6 text-center font-semibold text-white">
                  {item.name}
                </h3>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}