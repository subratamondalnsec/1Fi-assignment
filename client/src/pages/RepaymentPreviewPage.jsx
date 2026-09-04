import { Link } from "react-router-dom";
import { RepaymentPreview } from "../components/emi/RepaymentPreview";
import { buildRepaymentPreview, formatCurrencyINR } from "../utils/emiHelpers";

export function RepaymentPreviewPage() {
  const plan = {
    monthlyAmount: 11242,
    tenure: 12,
    interestRate: 0,
    cashback: 5000,
  };
  const payments = buildRepaymentPreview(plan);
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Demo financing preview
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Repayment Overview
        </h1>
        <p className="mt-2 text-slate-600">
          Illustrative schedule only. These values are not real 1Fi lending
          terms.
        </p>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-slate-600">Product</dt>
            <dd className="font-semibold text-slate-950">iPhone 17 Pro</dd>
          </div>
          <div>
            <dt className="text-slate-600">Variant</dt>
            <dd className="font-semibold text-slate-950">256GB Deep Blue</dd>
          </div>
          <div>
            <dt className="text-slate-600">EMI plan</dt>
            <dd className="font-semibold text-slate-950">
              {plan.tenure} months
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Monthly installment</dt>
            <dd className="font-semibold text-slate-950">
              {formatCurrencyINR(plan.monthlyAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Interest</dt>
            <dd className="font-semibold text-slate-950">
              {plan.interestRate}%
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Cashback</dt>
            <dd className="font-semibold text-slate-950">
              {formatCurrencyINR(plan.cashback)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Pay today</dt>
            <dd className="font-semibold text-slate-950">
              {formatCurrencyINR(plan.monthlyAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Total scheduled repayment</dt>
            <dd className="font-semibold text-slate-950">
              {formatCurrencyINR(plan.monthlyAmount * plan.tenure)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">Remaining installments</dt>
            <dd className="font-semibold text-slate-950">{plan.tenure - 1}</dd>
          </div>
        </dl>
      </section>
      <RepaymentPreview plan={plan} />
      <p className="text-sm text-slate-600">
        Showing {payments.length} key payments to keep long schedules easy to
        scan.
      </p>
      <Link
        className="inline-flex font-semibold text-indigo-600 hover:text-indigo-700"
        to="/"
      >
        Back to catalogue
      </Link>
    </section>
  );
}
