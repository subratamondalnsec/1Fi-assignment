import { calculateTotalPayable, formatInterestRate } from '../../utils/emiHelpers';
import { formatCurrency } from '../../utils/productHelpers';

export function SelectedEmiSummary({ plan }) {
  if (!plan) return null;
  const totalPayable = calculateTotalPayable(plan);

  return <aside aria-live="polite" className="rounded-xl border border-indigo-200 bg-indigo-50 p-5"><h2 className="text-base font-semibold text-slate-950">Selected Plan</h2><p className="mt-3 text-2xl font-bold text-slate-950">{formatCurrency(plan.monthlyAmount)} <span className="text-sm font-medium text-slate-600">/ month</span></p><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="text-slate-600">Tenure</dt><dd className="font-semibold text-slate-900">{plan.tenure} months</dd></div><div><dt className="text-slate-600">Interest</dt><dd className="font-semibold text-slate-900">{formatInterestRate(plan.interestRate)}</dd></div>{Number.isFinite(plan.cashback) && plan.cashback > 0 && <div><dt className="text-slate-600">Cashback</dt><dd className="font-semibold text-emerald-700">{formatCurrency(plan.cashback)}</dd></div>}<div><dt className="text-slate-600">Estimated Total</dt><dd className="font-semibold text-slate-900">{totalPayable === null ? 'Unavailable' : formatCurrency(totalPayable)}</dd></div></dl></aside>;
}
