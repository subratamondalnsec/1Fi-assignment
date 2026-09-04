import { useEffect, useState } from 'react';
import { Benefits, EmiExample, TrustStrip } from '../components/home/ValueSections';
import { EmiCalculator } from '../components/home/EmiCalculator';
import { Footer } from '../components/home/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { ProductDiscovery } from '../components/home/ProductDiscovery';
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

  return <div className="space-y-20 sm:space-y-28"><HeroSection /><TrustStrip /><section id="emi-calculator"><EmiCalculator /></section><HowItWorks /><section id="reviews" className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">Thoughtful by design</p><h2 className="mx-auto mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Built to make EMI choices easier to understand.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">This demonstration experience keeps plan information upfront, so you can compare a phone purchase with more confidence.</p></section>{status === 'loading' && <LoadingState />}{status === 'error' && <ErrorState message={error} />}{status === 'success' && products.length > 0 && <ProductDiscovery products={products} />}{status === 'success' && products.length === 0 && <EmptyState />}<Benefits /><EmiExample /><section id="faqs" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">FAQs</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">The essentials, made clear.</h2><div className="mt-7 grid gap-4 md:grid-cols-3"><Faq question="Are these live lending terms?" answer="No. The displayed plans and eligibility experience are illustrative demo features." /><Faq question="Can I compare tenures?" answer="Yes. Use the calculator or product-level plan options to compare monthly amounts." /><Faq question="Does the cart keep my plan?" answer="Yes. Your selected variant and EMI plan are saved in your local cart." /></div></section><Footer /></div>;
}

function Faq({ question, answer }) { return <article className="rounded-xl bg-slate-50 p-5"><h3 className="font-bold text-slate-950">{question}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p></article>; }

function LoadingState() {
  return <div aria-label="Loading products" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={index}><div className="aspect-[4/3] animate-pulse bg-slate-200" /><div className="space-y-3 p-5"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /><div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" /></div></div>)}</div>;
}

function ErrorState({ message }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-950"><h2 className="font-semibold">We couldn’t load the catalogue</h2><p className="mt-1 text-sm text-red-700">{message}</p></div>;
}

function EmptyState() {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-lg font-semibold text-slate-900">No products available yet</h2><p className="mt-2 text-sm text-slate-600">Please check back shortly for the latest smartphones.</p></div>;
}
