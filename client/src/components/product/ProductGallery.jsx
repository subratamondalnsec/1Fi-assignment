import { useEffect, useState } from 'react';

export function ProductGallery({ imageUrl, productName, variantName }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return <section aria-label="Product image" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="aspect-square bg-slate-100">{imageUrl && !imageFailed ? <img className="h-full w-full object-contain p-6 sm:p-10" src={imageUrl} alt={variantName ? `${productName} — ${variantName}` : productName} onError={() => setImageFailed(true)} /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6 text-center text-sm font-medium text-slate-500">Image unavailable</div>}</div></section>;
}
