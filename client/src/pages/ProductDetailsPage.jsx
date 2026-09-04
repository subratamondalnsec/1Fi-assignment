import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmiPlans } from '../components/emi/EmiPlans';
import { RepaymentPreview } from '../components/emi/RepaymentPreview';
import { SelectedEmiSummary } from '../components/emi/SelectedEmiSummary';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductPrice } from '../components/product/ProductPrice';
import { VariantSelector } from '../components/product/VariantSelector';
import { useCart } from '../hooks/useCart';
import { fetchProductBySlug } from '../services/productApi';
import { buildCartItem } from '../utils/cartHelpers';
import { calculateDemoInvestmentCoverage, getFirstPaymentAmount, getDemoEligibility } from '../utils/emiHelpers';
import { formatCurrency, getStockStatus } from '../utils/productHelpers';
import { getVariantByStorageAndColor } from '../utils/variantResolver';

export function ProductDetailsPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [cartFeedback, setCartFeedback] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      try {
        setStatus('loading');
        setError('');
        setProduct(null);
        setSelectedStorage(null);
        setSelectedColor(null);
        setSelectedEmiPlan(null);
        setCartFeedback(null);
        const loadedProduct = await fetchProductBySlug(slug, { signal: controller.signal });
        setProduct(loadedProduct);
        if (loadedProduct.variants.length > 0) {
          const firstVariant = loadedProduct.variants[0];
          setSelectedStorage(firstVariant.storage);
          setSelectedColor(firstVariant.color);
        }
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

  // Derive selectedVariant from storage and color selections
  const selectedVariant = useMemo(() => {
    if (!product || !selectedStorage || !selectedColor) return null;
    return getVariantByStorageAndColor(product.variants, selectedStorage, selectedColor);
  }, [product, selectedStorage, selectedColor]);

  if (status === 'loading') return <LoadingState />;
  if (status === 'not-found') return <NotFoundState />;
  if (status === 'error' || !product) return <ErrorState message={error} />;

  const combinationUnavailable = !selectedVariant;
  const stock = selectedVariant ? getStockStatus(selectedVariant.stock) : null;
  const emiPlans = Array.isArray(selectedVariant?.emiPlans) ? selectedVariant.emiPlans : [];
  const investmentCoverage = calculateDemoInvestmentCoverage(selectedEmiPlan);
  const demoInvestmentValue = (selectedVariant?.price ?? 0) * 0.5;
  const demoEligibility = getDemoEligibility(demoInvestmentValue, selectedVariant?.price ?? 0);

  function handleStorageChange(newStorage) {
    // Storage changes independently; color remains the same
    setSelectedStorage(newStorage);
    // Reset EMI plan since variant changed
    setSelectedEmiPlan(null);
    setCartFeedback(null);
  }

  function handleColorChange(newColor) {
    // Color changes independently; storage remains the same
    setSelectedColor(newColor);
    // Reset EMI plan since variant changed
    setSelectedEmiPlan(null);
    setCartFeedback(null);
  }

  function handleAddToCart() {
    if (isAdding) return;
    if (!selectedVariant) {
      setCartFeedback({ type: 'error', message: 'This combination is unavailable.' });
      return;
    }
    if (!selectedEmiPlan) {
      setCartFeedback({ type: 'error', message: 'Select an EMI plan before adding this phone to your cart.' });
      return;
    }
    try {
      setIsAdding(true);
      addItem(buildCartItem(product, selectedVariant, selectedEmiPlan));
      setCartFeedback({ type: 'success', message: 'Added to cart with the selected variant and EMI plan.' });
      window.setTimeout(() => setCartFeedback(null), 2400);
    } catch (cartError) {
      setCartFeedback({ type: 'error', message: cartError.message || 'This selection could not be added to cart.' });
    } finally {
      window.setTimeout(() => setIsAdding(false), 450);
    }
  }

  const firstPayment = getFirstPaymentAmount(selectedEmiPlan);
  const purchaseDisabled = !selectedVariant || selectedVariant.stock <= 0 || !selectedEmiPlan || isAdding;
  const purchaseLabel = !selectedVariant ? 'Unavailable' : !selectedEmiPlan ? 'Select an EMI plan' : isAdding ? 'Adding...' : cartFeedback?.type === 'success' ? '✓ Added to Cart' : 'Add to Cart';

  return <section className="space-y-6 pb-36 sm:pb-32">
    <Link className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700" to="/">← Back to catalogue</Link>
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-24"><ProductGallery images={selectedVariant?.images} imageUrl={selectedVariant?.imageUrl} productName={product.name} variantName={selectedVariant?.name} selectedColor={selectedColor} /></div>
      <div className="space-y-7">
        <div className="space-y-3"><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{product.brand || 'Smartphone'}</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>{product.description && <p className="max-w-2xl leading-7 text-slate-600">{product.description}</p>}</div>
        {selectedVariant && <><ProductPrice mrp={selectedVariant.mrp} price={selectedVariant.price} /><p className={`text-sm font-semibold ${stock.className}`} aria-live="polite">{stock.label}{selectedVariant.stock > 0 ? ` (${selectedVariant.stock} available)` : ''}</p></>}
        <VariantSelector variants={product.variants} selectedStorage={selectedStorage} selectedColor={selectedColor} onStorageChange={handleStorageChange} onColorChange={handleColorChange} />
        {combinationUnavailable && <p aria-live="polite" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">This combination is unavailable. Choose another storage or color.</p>}
        <section aria-labelledby="emi-plans-heading" className="space-y-4 border-t border-slate-200 pt-6">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Investment-backed EMI</p><h2 className="mt-1 text-xl font-semibold text-slate-950" id="emi-plans-heading">EMI plans backed by mutual funds</h2><p className="mt-1 text-sm leading-6 text-slate-600">Choose a repayment plan that fits your monthly budget. These are illustrative demo plans, not lending terms or eligibility decisions.</p></div>
          <EmiPlans onSelect={setSelectedEmiPlan} plans={emiPlans} selectedPlan={selectedEmiPlan} />
          <SelectedEmiSummary plan={selectedEmiPlan} />
          {selectedEmiPlan && <><RepaymentPreview plan={selectedEmiPlan} /><aside className="rounded-xl border border-slate-200 bg-slate-50 p-5"><h2 className="font-semibold text-slate-950">Estimated eligibility</h2><p className="mt-2 text-sm text-slate-600">Illustrative investment value: <span className="font-semibold text-slate-900">{formatCurrency(demoInvestmentValue)}</span></p><p className={`mt-1 text-sm ${demoEligibility === 'eligible' ? 'text-emerald-700' : 'text-amber-700'}`}>{demoEligibility === 'eligible' ? 'Eligible for demo onboarding' : 'Additional verification required'}</p><p className="mt-2 text-xs text-slate-500">Demo rule: investment value must be at least 75% of product price. This is not a credit decision or real verification.</p></aside><Link className="inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/repayment-preview">View full repayment schedule</Link></>}
        </section>
        <div className="border-t border-slate-200 pt-6"><p className="mb-3 text-sm text-slate-600">Selected variant: <span className="font-medium text-slate-900">{selectedVariant?.name || [selectedStorage, selectedColor].filter(Boolean).join(' · ') || 'Standard'}</span></p>{cartFeedback && <p aria-live="polite" className={`text-sm font-medium ${cartFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>{cartFeedback.message}</p>}</div>
      </div>
    </div>
    <div aria-label="Selected purchase plan" className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-4xl rounded-2xl border border-violet-100 bg-white/95 p-3 shadow-xl shadow-violet-950/10 backdrop-blur sm:bottom-5 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:px-5"><div className="hidden sm:block"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected EMI</p><p className="font-bold text-slate-950">{selectedEmiPlan ? `${formatCurrency(selectedEmiPlan.monthlyAmount)} / month` : 'Choose a plan'}</p></div><div className="hidden sm:block"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pay today</p><p className="font-bold text-slate-950">{firstPayment ? formatCurrency(firstPayment) : '—'}</p></div><div className="hidden sm:block"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next EMI</p><p className="font-bold text-slate-950">{selectedEmiPlan ? formatCurrency(selectedEmiPlan.monthlyAmount) : '—'}</p></div><div className="flex items-center justify-between gap-3 sm:block"><p className="text-xs font-semibold text-slate-500 sm:hidden">{selectedEmiPlan ? `${formatCurrency(selectedEmiPlan.monthlyAmount)}/mo · Pay today ${firstPayment ? formatCurrency(firstPayment) : '—'}` : 'Select an EMI plan to continue'}</p><button className={`mt-0 min-h-11 shrink-0 rounded-xl px-5 py-3 font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-0 ${cartFeedback?.type === 'success' ? 'bg-emerald-600' : 'bg-violet-600 hover:bg-violet-700 active:scale-[.98]'}`} disabled={purchaseDisabled} onClick={handleAddToCart} type="button">{purchaseLabel}</button></div></div>
  </section>;
}

function LoadingState() { return <div aria-label="Loading product" className="grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-12"><div className="aspect-square rounded-2xl bg-slate-200" /><div className="space-y-5"><div className="h-4 w-24 rounded bg-slate-200" /><div className="h-10 w-3/4 rounded bg-slate-200" /><div className="h-20 rounded bg-slate-200" /></div></div>; }
function NotFoundState() { return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-xl font-semibold text-slate-950">Product not found</h1><p className="mt-2 text-slate-600">This product may no longer be available.</p><Link className="mt-5 inline-flex font-semibold text-indigo-600" to="/">Return to catalogue</Link></div>; }
function ErrorState({ message }) { return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-950"><h1 className="font-semibold">We couldn’t load this product</h1><p className="mt-1 text-sm text-red-700">{message || 'Please try again later.'}</p><Link className="mt-4 inline-flex text-sm font-semibold text-red-800 underline" to="/">Return to catalogue</Link></div>; }
