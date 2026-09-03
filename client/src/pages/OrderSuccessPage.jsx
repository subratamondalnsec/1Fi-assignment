import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../services/orderApi';
import { formatCurrency } from '../utils/productHelpers';

export function OrderSuccessPage() {
  const { orderId } = useParams();
  const [state, setState] = useState({ status: 'loading', order: null, message: '' });

  useEffect(() => {
    let active = true;
    getOrder(orderId).then((order) => {
      if (active) setState({ status: 'ready', order, message: '' });
    }).catch((error) => {
      if (active) setState({ status: 'error', order: null, message: error.message });
    });
    return () => { active = false; };
  }, [orderId]);

  if (state.status === 'loading') return <section aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-8 text-center"><p className="font-semibold text-slate-950">Loading your confirmed order...</p></section>;
  if (state.status === 'error') return <section className="rounded-xl border border-red-200 bg-red-50 p-8"><h1 className="text-xl font-semibold text-red-950">Order could not be loaded</h1><p className="mt-2 text-red-800">{state.message}</p><Link className="mt-5 inline-flex font-semibold text-red-900 underline" to="/">Return to catalogue</Link></section>;

  const { order } = state;
  return <section className="space-y-6"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Order confirmed</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-emerald-950">Thank you for your purchase</h1><p className="mt-2 text-emerald-900">Order {order.orderNumber}</p></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">Purchased items</h2><div className="mt-4 space-y-4">{order.items.map((item) => <article className="flex gap-4 border-t border-slate-100 pt-4 first:border-t-0 first:pt-0" key={`${item.productId}-${item.variantId}-${item.emiPlanId}`}><div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.imageUrl ? <img alt={item.productName} className="h-full w-full object-contain" src={item.imageUrl} /> : null}</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-950">{item.productName}</h3><p className="text-sm text-slate-600">{item.variantName || [item.storage, item.color].filter(Boolean).join(' / ')}</p><p className="mt-1 text-sm text-slate-600">{item.emiTenure} months at {formatCurrency(item.emiMonthlyAmount)}/month</p><p className="text-sm text-slate-600">Cashback: {formatCurrency(item.emiCashback)}</p></div><p className="font-semibold text-slate-950">{formatCurrency(item.unitPrice * item.quantity)}</p></article>)}</div></section><aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-slate-950">Payment details</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-600">Total</dt><dd className="font-semibold text-slate-950">{formatCurrency(order.totalAmount)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Method</dt><dd className="font-semibold capitalize text-slate-950">{order.paymentMethod}</dd></div><div><dt className="text-slate-600">Razorpay payment ID</dt><dd className="mt-1 break-all font-medium text-slate-950">{order.razorpayPaymentId}</dd></div></dl><Link className="mt-6 inline-flex font-semibold text-indigo-600 hover:text-indigo-700" to="/">Continue shopping</Link></aside></div></section>;
}