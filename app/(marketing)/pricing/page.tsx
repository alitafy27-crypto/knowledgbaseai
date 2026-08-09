import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900 flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-slate-500">
          Choose the plan that works best for you and your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        
        {/* Free Plan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col">
          <h3 className="text-xl font-semibold mb-1">Free</h3>
          <p className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal text-slate-500">/mo</span></p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 Workspace</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 5 GB Storage</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100 AI Questions/mo</li>
            <li className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="h-4 w-4 text-slate-300" /> Team Collaboration</li>
          </ul>
          <Link href="/dashboard" className="w-full py-3 text-center rounded-xl border border-gray-300 bg-gray-50 text-sm font-semibold text-slate-700 hover:bg-gray-100 transition">
            Get Started
          </Link>
        </div>

        {/* Pro Plan (Active) */}
        <div className="rounded-2xl border-2 border-violet-500 bg-white p-8 shadow-lg shadow-violet-500/10 relative flex flex-col">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
          <h3 className="text-xl font-semibold mb-1 text-violet-600">Pro</h3>
          <p className="text-4xl font-bold mb-4">$29<span className="text-lg font-normal text-slate-500">/mo</span></p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited Workspaces</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 500 GB Storage</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited AI Questions</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Team Collaboration</li>
          </ul>
          <Link href="/dashboard" className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold shadow-md shadow-violet-500/20 hover:scale-[1.02] transition">
            Upgrade Now
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col">
          <h3 className="text-xl font-semibold mb-1">Enterprise</h3>
          <p className="text-4xl font-bold mb-4">Custom</p>
          <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dedicated Support</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom Integrations</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> On-Premise Options</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> SOC 2 Compliance</li>
          </ul>
          <Link href="/contact" className="w-full py-3 text-center rounded-xl border border-gray-300 bg-gray-50 text-sm font-semibold text-slate-700 hover:bg-gray-100 transition">
            Contact Sales
          </Link>
        </div>

      </div>
    </div>
  );
}