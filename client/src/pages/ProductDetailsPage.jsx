import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmiPlans } from '../components/emi/EmiPlans';
import { SelectedEmiSummary } from '../components/emi/SelectedEmiSummary';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductPrice } from '../components/product/ProductPrice';
import { VariantSelector } from '../components/product/VariantSelector';
import { fetchProductBySlug } from '../services/productApi';
import { calculateDemoInvestmentCoverage } from '../utils/emiHelpers';
import { formatCurrency, getStockStatus } from '../utils/productHelpers';

export function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        setStatus('loading');
        setError('');
        setProduct(null);
        setSelectedVariant(null);
        setSelectedEmiPlan(null);
        const loadedProduct = await fetchProductBySlug(slug, { signal: controller.signal });
        setProduct(loadedProduct);
        setSelectedVariant(loadedProduct.variants[0] || null);
        setStatus('success');
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Product could not be loaded.');
          setStatus(requestError.status === 404 ? 'not-found' : 'error');
        }
      }
    }

    loadProduct();
    return () => controller.abort();
  }, [slug]);

  if (status === 'loading') return <LoadingState />;
  if (status === 'not-found') return <NotFoundState />;
  if (status === 'error' || !product || !selectedVariant) return <ErrorState message={error} />;

  const stock = getStockStatus(selectedVariant.stock);
  const emiPlans = Array.isArray(selectedVariant.emiPlans) ? selectedVariant.emiPlans : [];
  const investmentCoverage = calculateDemoInvestmentCoverage(selectedEmiPlan);

  function handleVariantSelect(variant) {
    if (variant.id !== selectedVariant.id) {
      setSelectedVariant(variant);
      setSelectedEmiPlan(null);
    }
  }

  return <section className="space-y-6"><Link className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" to="/">← Back to catalogue</Link><div className="grid gap-8 lg:grid-cols-2 lg:gap-12"><ProductGallery imageUrl={selectedVariant.imageUrl} productName={product.name} variantName={selectedVariant.name} /><div className="space-y-7"><div className="space-y-3"><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{product.brand || 'Smartphone'}</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>{product.description && <p className="max-w-2xl leading-7 text-slate-600">{product.description}</p>}</div><ProductPrice mrp={selectedVariant.mrp} price={selectedVariant.price} /><p className={`text-sm font-semibold ${stock.className}`} aria-live="polite">{stock.label}{Number.isFinite(selectedVariant.stock) && selectedVariant.stock > 0 ? ` (${selectedVariant.stock} available)` : ''}</p><VariantSelector variants={product.variants} selectedVariant={selectedVariant} onSelect={handleVariantSelect} /><section aria-labelledby="emi-plans-heading" className="space-y-4 border-t border-slate-200 pt-6"><div><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Investment-backed EMI</p><h2 className="mt-1 text-xl font-semibold text-slate-950" id="emi-plans-heading">Choose an EMI plan</h2><p className="mt-1 text-sm leading-6 text-slate-600">Explore mutual-fund-backed financing options for this variant. Plan selection is for demonstration only and does not verify investments or determine eligibility.</p></div><EmiPlans onSelect={setSelectedEmiPlan} plans={emiPlans} selectedPlan={selectedEmiPlan} /><SelectedEmiSummary plan={selectedEmiPlan} />{selectedEmiPlan && <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5"><h2 className="font-semibold text-slate-950">Investment-backed eligibility</h2><p className="mt-2 text-sm text-slate-600">Estimated monthly investment coverage</p><p className="mt-1 text-2xl font-bold text-slate-950">{investmentCoverage === null ? 'Unavailable' : formatCurrency(investmentCoverage)}</p><p className="mt-2 text-xs text-slate-500">Demo estimate: 20% of the selected monthly installment. This is not a credit decision or investment verification.</p><span className="mt-3 inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">Status: Demo estimate</span></aside>}</section><div className="border-t border-slate-200 pt-6"><p className="mb-3 text-sm text-slate-600">Selected variant: <span className="font-medium text-slate-900">{selectedVariant.name || [selectedVariant.storage, selectedVariant.color].filter(Boolean).join(' · ') || 'Standard'}</span></p><div className="grid gap-3 sm:grid-cols-2"><button className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 font-semibold text-slate-400" disabled type="button">Add to Cart</button><button className="rounded-lg bg-indigo-200 px-4 py-3 font-semibold text-indigo-700" disabled type="button">Buy Now</button></div><p className="mt-3 text-xs text-slate-500">Cart and checkout will be available soon.</p></div></div></div></section>;
}

function LoadingState() {
  return <div aria-label="Loading product" className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-12"><div className="aspect-square rounded-2xl bg-slate-200" /><div className="space-y-5"><div className="h-4 w-24 rounded bg-slate-200" /><div className="h-10 w-3/4 rounded bg-slate-200" /><div className="h-20 rounded bg-slate-200" /><div className="h-10 w-1/2 rounded bg-slate-200" /></div></div>;
}

function NotFoundState() {
  return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-xl font-semibold text-slate-950">Product not found</h1><p className="mt-2 text-slate-600">This product may no longer be available.</p><Link className="mt-5 inline-flex font-semibold text-indigo-600 hover:text-indigo-700" to="/">Return to catalogue</Link></div>;
}

function ErrorState({ message }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-950"><h1 className="font-semibold">We couldn’t load this product</h1><p className="mt-1 text-sm text-red-700">{message || 'Please try again later.'}</p><Link className="mt-4 inline-flex text-sm font-semibold text-red-800 underline" to="/">Return to catalogue</Link></div>;
}
