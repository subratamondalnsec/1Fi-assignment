import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getDiscountPercentage, getMinimumEmi, getMinimumVariantMrp, getMinimumVariantPrice } from '../../utils/productHelpers';

export function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const variants = product.variants || [];
  const price = getMinimumVariantPrice(variants);
  const mrp = getMinimumVariantMrp(variants);
  const discount = getDiscountPercentage(mrp, price);
  const minimumEmi = getMinimumEmi(variants);
  const imageUrl = variants.find((variant) => variant.images?.[0])?.images[0] || variants.find((variant) => variant.imageUrl)?.imageUrl;

  return <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><Link className="block" to={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}><div className="relative aspect-[4/3] overflow-hidden bg-slate-100">{imageUrl && !imageFailed ? <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={imageUrl} alt={product.name} onError={() => setImageFailed(true)} /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">Image unavailable</div>}{discount && <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">{discount}% off</span>}</div><div className="space-y-3 p-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{product.brand || 'Smartphone'}</p><h3 className="mt-1 text-lg font-semibold text-slate-950">{product.name}</h3></div><div className="flex items-end gap-2"><p className="text-lg font-bold text-slate-950">{price === null ? 'Price on request' : `From ${formatCurrency(price)}`}</p>{mrp && price !== null && mrp > price && <p className="pb-0.5 text-sm text-slate-400 line-through">{formatCurrency(mrp)}</p>}</div>{minimumEmi !== null && <p className="text-sm text-slate-600">Starting EMI <span className="font-semibold text-slate-900">{formatCurrency(minimumEmi)}/mo</span></p>}<span className="inline-flex items-center text-sm font-semibold text-indigo-600">View Details <span aria-hidden="true" className="ml-1 transition group-hover:translate-x-1">→</span></span></div></Link></article>;
}
