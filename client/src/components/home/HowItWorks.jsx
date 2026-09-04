const steps = [
  [
    "01",
    "Choose your device",
    "Browse the catalogue and compare the phone that feels right for you.",
  ],
  [
    "02",
    "Pick an EMI plan",
    "Review the tenure, monthly amount, cashback, and scheduled repayment.",
  ],
  [
    "03",
    "Complete demo eligibility flow",
    "Continue through our illustrative investment-backed experience.",
  ],
  [
    "04",
    "Pay and manage repayments",
    "Checkout securely and use the repayment preview to stay organised.",
  ],
];

export function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
          How it works
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Simple choices. A clearer way to pay.
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([number, title, copy]) => (
          <article
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5"
            key={number}
          >
            <p className="text-4xl font-bold tracking-tighter text-indigo-200 transition group-hover:text-indigo-500">
              {number}
            </p>
            <h3 className="mt-8 text-lg font-bold text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
