import { formatCurrency } from "../../utils/productHelpers";
import { getNextDueDate } from "../../utils/emiHelpers";

const benefits = [
  [
    "Keep investments invested",
    "Explore an investment-aware way to plan your purchase without presenting this demo as verification.",
  ],
  [
    "Flexible repayment",
    "Compare shorter and longer tenures to find a monthly amount that works for you.",
  ],
  [
    "Transparent costs",
    "See rate, monthly amount, cashback, and scheduled repayment before checkout.",
  ],
  [
    "Secure checkout",
    "Complete the existing protected payment flow when you are ready.",
  ],
];
export function TrustStrip() {
  return (
    <section className="grid grid-cols-2 divide-x divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 sm:grid-cols-4 sm:divide-y-0">
      <div className="p-4">✦ 0% interest options</div>
      <div className="p-4">◒ Investment-aware</div>
      <div className="p-4">✓ Transparent EMI</div>
      <div className="p-4">⌁ Secure checkout</div>
    </section>
  );
}
export function Benefits() {
  return (
    <section className="rounded-[2rem] bg-indigo-50 p-6 sm:p-10 lg:p-14">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
          Why this model
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          More intention behind every upgrade.
        </h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([title, copy]) => (
          <article
            className="rounded-2xl border border-white bg-white/80 p-5"
            key={title}
          >
            <h3 className="font-bold text-slate-950">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function EmiExample() {
  const nextDate = getNextDueDate();
  return (
    <section className="grid overflow-hidden rounded-[2rem] bg-slate-950 text-white lg:grid-cols-[.9fr_1.1fr]">
      <div className="p-8 sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-300">
          Illustrative EMI example
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          See the monthly view at a glance.
        </h2>
        <p className="mt-4 max-w-md leading-7 text-slate-300">
          Example figures are illustrative and mirror the plan information shown
          across the catalogue.
        </p>
      </div>
      <div className="m-4 rounded-2xl bg-white p-6 text-slate-950 sm:m-8 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Phone price</p>
            <p className="mt-1 text-2xl font-bold">₹79,999</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Selected plan</p>
            <p className="mt-1 text-2xl font-bold">12 months</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Monthly payment</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {formatCurrency(6667)}/mo
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">First payment today</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(6667)}</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
          <span className="text-slate-500">Next payment </span>
          <strong>
            {nextDate?.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </strong>
        </div>
      </div>
    </section>
  );
}
