import { formatCurrency, getDiscountPercentage, getSavingsAmount } from '../../utils/productHelpers';

export function ProductPrice({ mrp, price }) {
  const discount = getDiscountPercentage(mrp, price);
  const savings = getSavingsAmount(mrp, price);

  if (!Number.isFinite(price)) return <p className="text-lg font-semibold text-slate-900">Price on request</p>;

  return <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><p className="text-3xl font-bold tracking-tight text-slate-950">{formatCurrency(price)}</p>{Number.isFinite(mrp) && mrp > price && <><p className="text-base text-slate-400 line-through">MRP {formatCurrency(mrp)}</p><p className="text-sm font-semibold text-emerald-700">{discount}% off</p>{savings !== null && <p className="basis-full text-sm text-emerald-700">You save {formatCurrency(savings)}</p>}</>}</div>;
}
