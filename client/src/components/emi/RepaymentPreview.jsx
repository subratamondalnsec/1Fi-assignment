import {
  buildRepaymentPreview,
  formatCurrencyINR,
} from "../../utils/emiHelpers";

export function RepaymentPreview({
  plan,
  referenceDate = new Date(),
  onViewFullSchedule,
}) {
  if (!plan) return null;
  const payments = buildRepaymentPreview(plan, referenceDate);
  return (
    <section
      aria-labelledby="repayment-preview-heading"
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          className="text-base font-semibold text-slate-950"
          id="repayment-preview-heading"
        >
          Repayment timeline
        </h2>
        {onViewFullSchedule && (
          <button
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            onClick={onViewFullSchedule}
            type="button"
          >
            View repayment schedule
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {payments.map((payment) => (
          <div
            className="rounded-lg bg-slate-50 p-3"
            key={payment.installmentNumber}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {payment.isFirst
                ? "Today"
                : payment.isFinal
                  ? "Final payment"
                  : `Payment ${payment.installmentNumber}`}
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {formatCurrencyINR(payment.amount)}
            </p>
            <p className="text-sm text-slate-600">
              {payment.date?.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
