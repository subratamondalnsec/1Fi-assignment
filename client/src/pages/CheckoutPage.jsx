import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createEmptyAddress, getCheckoutSummary, validateAddress } from '../utils/checkoutHelpers';
import { formatInterestRate } from '../utils/emiHelpers';
import { formatCurrency } from '../utils/productHelpers';

const addressFields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'phone', label: 'Phone', autoComplete: 'tel', type: 'tel' },
  { name: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
  { name: 'address', label: 'Address', autoComplete: 'street-address', fullWidth: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'state', label: 'State', autoComplete: 'address-level1' },
  { name: 'pincode', label: 'Pincode', autoComplete: 'postal-code', type: 'text' },
];

export function CheckoutPage() {
  const { items } = useCart();
  const [address, setAddress] = useState(createEmptyAddress);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const summary = getCheckoutSummary(items);

  function handleChange(event) {
    const { name, value } = event.target;
    setAddress((currentAddress) => ({ ...currentAddress, [name]: value }));
    if (errors[name]) setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateAddress(address);
    setErrors(validationErrors);
    setNotice(Object.keys(validationErrors).length ? 'Complete the required delivery details to continue.' : 'Payment is not available yet. Your cart and delivery details have not been submitted.');
  }

  if (!items.length) return <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><h1 className="text-xl font-semibold text-slate-950">Your cart is empty</h1><p className="mt-2 text-slate-600">Add a phone before proceeding to checkout.</p><Link className="mt-5 inline-flex font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" to="/">Browse catalogue</Link></section>;

  return <section className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Checkout</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Review your order</h1></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"><form className="space-y-6" noValidate onSubmit={handleSubmit}><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">Delivery details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{addressFields.map(({ name, label, autoComplete, fullWidth, type = 'text' }) => <label className={fullWidth ? 'sm:col-span-2' : ''} key={name}><span className="text-sm font-medium text-slate-700">{label}</span>{name === 'address' ? <textarea aria-describedby={errors[name] ? `${name}-error` : undefined} autoComplete={autoComplete} className={`mt-1 w-full rounded-lg border px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${errors[name] ? 'border-red-500' : 'border-slate-300'}`} name={name} onChange={handleChange} rows="3" value={address[name]} /> : <input aria-describedby={errors[name] ? `${name}-error` : undefined} autoComplete={autoComplete} className={`mt-1 w-full rounded-lg border px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${errors[name] ? 'border-red-500' : 'border-slate-300'}`} name={name} onChange={handleChange} type={type} value={address[name]} />}{errors[name] && <span className="mt-1 block text-sm text-red-700" id={`${name}-error`}>{errors[name]}</span>}</label>)}</div></section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">Items ({summary.totalItems})</h2><div className="mt-4 space-y-4">{items.map((item) => <article className="flex gap-3 border-t border-slate-100 pt-4 first:border-0 first:pt-0" key={item.id}><div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.imageUrl ? <img alt={item.productName} className="h-full w-full object-cover" src={item.imageUrl} /> : <div className="flex h-full items-center justify-center text-xs text-slate-500">No image</div>}</div><div className="min-w-0 flex-1"><h3 className="font-medium text-slate-950">{item.productName}</h3><p className="mt-1 text-sm text-slate-600">{item.variantName || [item.storage, item.color].filter(Boolean).join(' · ')} · Qty {item.quantity}</p><p className="mt-1 font-semibold text-slate-950">{formatCurrency(item.price)}</p><p className="mt-1 text-sm text-slate-600">EMI: {formatCurrency(item.monthlyPayment)}/month · {item.emiTenure} months · {formatInterestRate(item.interestRate)}{Number.isFinite(item.cashback) && item.cashback > 0 ? ` · ${formatCurrency(item.cashback)} cashback` : ''}</p></div></article>)}</div></section></form><aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">Order summary</h2><dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-600">Total items</dt><dd className="font-medium text-slate-900">{summary.totalItems}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Cart subtotal</dt><dd className="font-medium text-slate-900">{formatCurrency(summary.subtotal)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Platform fee</dt><dd className="font-medium text-slate-900">{formatCurrency(summary.platformFee)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Delivery fee</dt><dd className="font-medium text-slate-900">{formatCurrency(summary.deliveryFee)}</dd></div><div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base"><dt className="font-semibold text-slate-950">Final amount</dt><dd className="font-bold text-slate-950">{formatCurrency(summary.finalAmount)}</dd></div></dl><button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" form="checkout-form" onClick={handleSubmit} type="submit">Continue to Payment</button>{notice && <p aria-live="polite" className="mt-3 text-sm text-slate-600">{notice}</p>}<p className="mt-3 text-xs leading-5 text-slate-500">Payment is not available in this checkout foundation.</p></aside></div></section>;
}
