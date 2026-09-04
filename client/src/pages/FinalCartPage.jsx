import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { calculateCartSubtotal } from "../utils/cartHelpers";
import {
  calculateScheduledRepayment,
  getNextDueDate,
} from "../utils/emiHelpers";
import { formatCurrency } from "../utils/productHelpers";
export function FinalCartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  if (!items.length)
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-dashed border-violet-200 bg-white p-8 text-center">
        <div className="text-3xl">🛒</div>
        <h1 className="mt-3 text-2xl font-bold">Your cart is waiting.</h1>
        <p className="mt-2 text-slate-600">
          Explore smartphones and choose an EMI plan that works for you.
        </p>
        <Link
          className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
          to="/#catalog"
        >
          Explore Phones
        </Link>
      </section>
    );
  const phonePrice = calculateCartSubtotal(items);
  const first = items.reduce(
    (sum, item) => sum + item.firstPaymentAmount * item.quantity,
    0,
  );
  const scheduled = items.reduce(
    (sum, item) =>
      sum +
      calculateScheduledRepayment({
        monthlyAmount: item.monthlyPayment,
        tenure: item.emiTenure,
      }) *
        item.quantity,
    0,
  );
  const firstItem = items[0];
  const due = getNextDueDate();
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
          Your selections
        </p>
        <h1 className="text-3xl font-bold">Cart items</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              className="flex gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"
              key={item.id}
            >
              <img
                className="h-24 w-24 rounded-xl bg-slate-50 object-contain"
                src={item.imageUrl}
                alt={item.productName}
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{item.productName}</h2>
                <p className="text-sm text-slate-600">
                  {item.storage} · {item.color}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="block text-slate-500">EMI plan</span>
                    {item.emiTenure} months
                  </p>
                  <p>
                    <span className="block text-slate-500">Monthly EMI</span>
                    {formatCurrency(item.monthlyPayment)}
                  </p>
                  <p>
                    <span className="block text-slate-500">First payment</span>
                    {formatCurrency(item.firstPaymentAmount)}
                  </p>
                  <p>
                    <span className="block text-slate-500">Phone price</span>
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3"><div className="inline-flex items-center rounded-lg border border-violet-100"><button aria-label={`Decrease quantity for ${item.productName}`} className="px-2.5 py-1 text-violet-700 disabled:text-slate-300" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} type="button">−</button><span aria-label={`Quantity ${item.quantity}`} className="min-w-8 text-center text-sm font-bold">{item.quantity}</span><button aria-label={`Increase quantity for ${item.productName}`} className="px-2.5 py-1 text-violet-700" onClick={() => updateQuantity(item.id, item.quantity + 1)} type="button">+</button></div><button className="text-sm font-semibold text-rose-700" onClick={() => removeItem(item.id)} type="button">Remove</button></div>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Phone price" value={formatCurrency(phonePrice)} />
            <Row label="EMI plan" value={`${firstItem.emiTenure} months`} />
            <Row
              label="Monthly payment"
              value={formatCurrency(firstItem.monthlyPayment)}
            />
            <Row label="Pay today" value={formatCurrency(first)} />
            <Row
              label="Next payment"
              value={formatCurrency(firstItem.monthlyPayment)}
            />
            <Row
              label="Due"
              value={due?.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <Row
              label="Total scheduled repayment"
              value={formatCurrency(scheduled)}
            />
          </dl>
          <Link
            className="mt-6 flex justify-center rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white"
            to="/checkout"
          >
            Proceed to Checkout
          </Link>
          <Link
            className="mt-3 flex justify-center rounded-xl border border-violet-200 px-4 py-3 font-semibold text-violet-700"
            to="/#catalog"
          >
            Continue Shopping
          </Link>
          <p className="mt-3 text-xs text-slate-500">
            Pay today is the first EMI installment, not the full phone price.
          </p>
        </aside>
      </div>
    </section>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
