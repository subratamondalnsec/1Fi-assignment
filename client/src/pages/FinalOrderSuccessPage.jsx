import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/orderApi";
import { formatCurrency } from "../utils/productHelpers";
import { getInstallmentDate } from "../utils/emiHelpers";
export function FinalOrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setOrder(false));
  }, [orderId]);
  if (order === null)
    return <p className="py-12 text-center">Loading your order…</p>;
  if (!order)
    return (
      <section className="rounded-2xl bg-rose-50 p-6">
        Order could not be loaded.
      </section>
    );
  const item = order.items[0];
  const total = item.emiMonthlyAmount * item.emiTenure;
  const remaining = total - item.firstPaymentAmount;
  const dates = [1, 2, item.emiTenure].map((number) =>
    getInstallmentDate(new Date(order.createdAt), number),
  );
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl bg-violet-700 p-7 text-white">
        <p className="font-bold">✓ Order Confirmed</p>
        <h1 className="mt-2 text-3xl font-bold">
          Your purchase has been recorded successfully.
        </h1>
        <p className="mt-2 text-violet-100">
          Illustrative repayment information for this demo order.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-violet-100 bg-white p-6">
          <div className="flex gap-4">
            <img
              className="h-24 w-24 rounded-xl bg-violet-50 object-contain"
              src={item.imageUrl}
              alt={item.productName}
            />
            <div>
              <p className="text-sm font-bold text-violet-600">Product</p>
              <h2 className="text-xl font-bold">{item.productName}</h2>
              <p className="text-slate-600">
                {item.storage} · {item.color}
              </p>
            </div>
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <Metric label="EMI plan" value={`${item.emiTenure} months`} />
            <Metric
              label="Monthly payment"
              value={formatCurrency(item.emiMonthlyAmount)}
            />
            <Metric
              label="First payment"
              value={formatCurrency(item.firstPaymentAmount)}
            />
            <Metric
              label="Next payment"
              value={formatCurrency(item.emiMonthlyAmount)}
            />
            <Metric
              label="Next due"
              value={new Date(item.nextDueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          </dl>
        </section>
        <aside className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <p className="font-bold text-violet-700">Next Payment</p>
          <p className="mt-2 text-3xl font-bold">
            {formatCurrency(item.emiMonthlyAmount)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Due{" "}
            {new Date(item.nextDueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </aside>
      </div>
      <section className="rounded-2xl border border-violet-100 bg-white p-6">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Repayment Progress</h2>
            <p className="text-sm text-slate-600">
              1 of {item.emiTenure} payments
            </p>
          </div>
          <p className="font-bold text-violet-700">
            {formatCurrency(item.firstPaymentAmount)} paid
          </p>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-violet-600"
            style={{ width: `${100 / item.emiTenure}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Remaining: <strong>{formatCurrency(remaining)}</strong>
        </p>
        <h3 className="mt-7 font-bold">Illustrative repayment schedule</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {dates.map((date, index) => (
            <div className="rounded-xl bg-slate-50 p-4" key={index}>
              <p className="text-xs font-bold uppercase text-slate-500">
                {index === 0
                  ? "Today · Paid"
                  : index === 1
                    ? "Next month"
                    : "Final installment"}
              </p>
              <p className="mt-2 font-bold">
                {formatCurrency(item.emiMonthlyAmount)}
              </p>
              <p className="text-sm text-slate-600">
                {date?.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
          to={`/orders/${order.id}/repayment`}
        >
          View Repayment Plan
        </Link>
        <Link
          className="rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-700"
          to="/orders"
        >
          View All Orders
        </Link>
        <Link
          className="rounded-xl border border-slate-200 px-5 py-3 font-semibold"
          to="/#catalog"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
function Metric({ label, value }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold">{value}</dd>
    </div>
  );
}
