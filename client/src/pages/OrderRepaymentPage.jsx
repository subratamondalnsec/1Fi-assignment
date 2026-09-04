import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../services/orderApi";
import { formatCurrency } from "../utils/productHelpers";
import { getInstallmentDate } from "../utils/emiHelpers";

export function OrderRepaymentPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setOrder(false));
  }, [orderId]);
  if (order === null)
    return <p className="py-10 text-center">Loading repayment plan…</p>;
  if (!order)
    return (
      <section className="rounded-xl bg-red-50 p-6 text-red-800">
        This order could not be found.
      </section>
    );
  const item = order.items[0];
  const payments = Array.from({ length: item.emiTenure }, (_, index) => ({
    number: index + 1,
    date: getInstallmentDate(new Date(order.createdAt), index + 1),
  }));
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link className="text-sm font-semibold text-indigo-600" to="/orders">
        ← Orders
      </Link>
      <header className="rounded-2xl bg-slate-950 p-7 text-white">
        <p className="text-sm font-bold text-indigo-300">
          Active repayment plan
        </p>
        <h1 className="mt-1 text-3xl font-bold">{item.productName}</h1>
        <p className="mt-1 text-slate-300">
          {item.storage} · {item.color} · {item.emiTenure}-month EMI
        </p>
        <p className="mt-6 text-3xl font-bold">
          {formatCurrency(item.emiMonthlyAmount)}
          <span className="text-base font-medium text-slate-400"> / month</span>
        </p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[8%] rounded-full bg-indigo-600" />
        </div>
        <p className="mt-3 text-sm text-slate-600">
          1 of {item.emiTenure} installments paid · {item.emiTenure - 1}{" "}
          remaining
        </p>
        <div className="mt-6 space-y-3">
          {payments.map((payment) => (
            <article
              className={`flex items-center justify-between rounded-xl p-4 ${payment.number === 1 ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-900"}`}
              key={payment.number}
            >
              <div>
                <p className="font-bold">
                  {payment.number === 1
                    ? "✓ First installment paid"
                    : payment.number === 2
                      ? "Next installment"
                      : `Month ${payment.number}`}
                </p>
                <p className="text-sm opacity-70">
                  {payment.date?.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="font-bold">
                {formatCurrency(item.emiMonthlyAmount)}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500">
          This is a persisted demo repayment schedule based on the completed
          order snapshot, not a lender account.
        </p>
      </section>
    </section>
  );
}
