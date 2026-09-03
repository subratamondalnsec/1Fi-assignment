import { useEffect, useState } from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { fetchProducts } from '../services/productApi';

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setStatus('loading');
        setError('');
        setProducts(await fetchProducts({ signal: controller.signal }));
        setStatus('success');
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Products could not be loaded.');
          setStatus('error');
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return <section className="space-y-8"><div className="max-w-2xl space-y-3"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Find your next phone</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Shop smartphones with flexible monthly payments.</h1><p className="text-base leading-7 text-slate-600">Compare the latest devices, colours, storage options, and pricing in one place.</p></div>{status === 'loading' && <LoadingState />}{status === 'error' && <ErrorState message={error} />}{status === 'success' && products.length === 0 && <EmptyState />}{status === 'success' && products.length > 0 && <ProductGrid products={products} />}</section>;
}

function LoadingState() {
  return <div aria-label="Loading products" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={index}><div className="aspect-[4/3] animate-pulse bg-slate-200" /><div className="space-y-3 p-5"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /><div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" /></div></div>)}</div>;
}

function ErrorState({ message }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-950"><h2 className="font-semibold">We couldn’t load the catalogue</h2><p className="mt-1 text-sm text-red-700">{message}</p></div>;
}

function EmptyState() {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-lg font-semibold text-slate-900">No products available yet</h2><p className="mt-2 text-sm text-slate-600">Please check back shortly for the latest smartphones.</p></div>;
}
