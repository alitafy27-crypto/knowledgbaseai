const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "Perfect for individuals",
    features: [
      "1 Knowledge Base",
      "5 GB Storage",
      "GPT Integration",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    price: "$49",
    popular: true,
    description: "Best for growing teams",
    features: [
      "Unlimited Knowledge",
      "Unlimited Documents",
      "Claude + GPT",
      "Priority Support",
      "API Access",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large companies",
    features: [
      "Dedicated Infrastructure",
      "Private Deployment",
      "SSO",
      "Unlimited Everything",
      "24/7 Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            Pricing
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Choose Your Plan
          </h2>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 ${
                plan.popular
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-slate-900/40"
              }`}
            >
              {plan.popular && (
                <span className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold">
                  Most Popular
                </span>
              )}

              <h3 className="mt-6 text-3xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-2 text-slate-400">
                {plan.description}
              </p>

              <div className="mt-8 text-5xl font-bold text-white">
                {plan.price}
              </div>

              <div className="mt-10 space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="text-slate-300">
                    ✓ {feature}
                  </div>
                ))}
              </div>

              <button className="mt-10 w-full rounded-xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500">
                Get Started
              </button>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}