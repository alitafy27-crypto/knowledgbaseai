import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32">

      <div className="mx-auto max-w-7xl px-6">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 p-14">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.2),transparent_35%)]" />

          <div className="relative mx-auto max-w-3xl text-center">

            <h2 className="text-5xl font-bold text-white">
              Ready To Build Your AI Assistant?
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/90">
              Create your enterprise knowledge base, upload documents,
              connect GPT and start answering questions in seconds.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-5">

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-slate-900 transition hover:scale-105"
              >
                Start Free
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#pricing"
                className="rounded-xl border border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                View Pricing
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}