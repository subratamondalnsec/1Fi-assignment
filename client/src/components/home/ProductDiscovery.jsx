import { Link } from "react-router-dom";
import {
  formatCurrency,
  getDiscountPercentage,
  getMinimumEmi,
  getMinimumVariantMrp,
  getMinimumVariantPrice,
} from "../../utils/productHelpers";

function DiscoveryCard({ product, index }) {
  const variants = product.variants || [];
  const price = getMinimumVariantPrice(variants);
  const mrp = getMinimumVariantMrp(variants);
  const image = variants.find((variant) => variant.imageUrl)?.imageUrl;
  const emi = getMinimumEmi(variants);
  const colors = [
    ...new Set(variants.map((variant) => variant.color).filter(Boolean)),
  ];
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/10">
      <Link className="block" to={`/products/${product.slug}`}>
        <div className="relative aspect-[5/4] bg-slate-50 p-5">
          <img
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            src={image}
          />
          <span className="absolute left-4 top-4 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
            ★ {(4.8 - index * 0.1).toFixed(1)}
          </span>
          {getDiscountPercentage(mrp, price) && (
            <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {getDiscountPercentage(mrp, price)}% off
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {product.brand}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">
            {product.name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-950">
              {formatCurrency(price)}
            </span>
            {mrp > price && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(mrp)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            From{" "}
            <strong className="text-slate-900">{formatCurrency(emi)}/mo</strong>
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
              {colors.slice(0, 3).map((color) => (
                <span
                  className="h-2.5 w-2.5 rounded-full bg-indigo-300 ring-1 ring-indigo-100"
                  key={color}
                  title={color}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-indigo-600">
              View EMI options →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductDiscovery({ products }) {
  return (
    <section id="catalog">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
            Smart shopping
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Find a phone. Fit it to your month.
          </h2>
        </div>
        <Link
          className="font-semibold text-indigo-600 hover:text-indigo-700"
          to="/"
        >
          Browse catalogue →
        </Link>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <DiscoveryCard index={index % 4} key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
