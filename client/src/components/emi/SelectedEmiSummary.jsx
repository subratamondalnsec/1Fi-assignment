import { calculateScheduledRepayment, formatInterestRate, getFirstPaymentAmount, getNextDueDate, getRemainingInstallments } from '../../utils/emiHelpers';
import { formatCurrency } from '../../utils/productHelpers';

export function SelectedEmiSummary({ plan }) {
  if (!plan) return null;
  const totalPayable = calculateScheduledRepayment(plan);
  const nextDueDate = getNextDueDate();
  const formattedNextDueDate = nextDueDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return <aside aria-live="polite" className="rounded-xl border border-indigo-200 bg-indigo-50 p-5"><h2 className="text-base font-semibold text-slate-950">Your selected EMI</h2><p className="mt-3 text-2xl font-bold text-slate-950">{formatCurrency(plan.monthlyAmount)} <span className="text-sm font-medium text-slate-600">/ month</span></p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-slate-600">Tenure</dt><dd className="font-semibold text-slate-900">{plan.tenure} months</dd></div><div><dt className="text-slate-600">Interest</dt><dd className="font-semibold text-slate-900">{formatInterestRate(plan.interestRate)}</dd></div><div><dt className="text-slate-600">Cashback</dt><dd className="font-semibold text-emerald-700">{formatCurrency(plan.cashback || 0)}</dd></div><div><dt className="text-slate-600">Pay today</dt><dd className="font-semibold text-slate-900">{formatCurrency(getFirstPaymentAmount(plan))}</dd></div><div><dt className="text-slate-600">Next payment</dt><dd className="font-semibold text-slate-900">{formatCurrency(plan.monthlyAmount)}<span className="block font-normal text-slate-600">Due {formattedNextDueDate}</span></dd></div><div><dt className="text-slate-600">Total scheduled repayment</dt><dd className="font-semibold text-slate-900">{formatCurrency(totalPayable)}</dd></div><div><dt className="text-slate-600">Remaining payments</dt><dd className="font-semibold text-slate-900">{getRemainingInstallments(plan.tenure)}</dd></div></dl></aside>;
}
