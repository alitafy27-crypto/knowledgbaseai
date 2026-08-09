const faqs = [
  {
    q: "What is RAG?",
    a: "Retrieval-Augmented Generation combines document retrieval with large language models for highly accurate responses.",
  },
  {
    q: "Which AI models are supported?",
    a: "OpenAI GPT, Claude, Gemini, Llama, Mistral and custom models.",
  },
  {
    q: "Can I upload PDF documents?",
    a: "Yes. PDF, DOCX, TXT, Markdown and many other formats are supported.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Enterprise encryption, private vector databases and secure deployment are supported.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-28">

      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            FAQ
          </span>

          <h2 className="mt-6 text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="mt-20 space-y-6">

          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-3xl border border-white/10 bg-slate-900/40 p-8"
            >
              <h3 className="text-2xl font-semibold text-white">
                {faq.q}
              </h3>

              <p className="mt-4 leading-8 text-slate-400">
                {faq.a}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}