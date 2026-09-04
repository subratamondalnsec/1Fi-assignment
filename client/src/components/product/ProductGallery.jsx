import { useEffect, useState } from 'react';

export function ProductGallery({ images = [], imageUrl, productName, variantName, selectedColor }) {
  const galleryImages = [...new Set(images.length ? images : (imageUrl ? [imageUrl] : []))];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    // Reset to the first image when images change (which happens when color changes)
    setSelectedIndex(0);
    setImageFailed(false);
  }, [images, imageUrl, selectedColor]);

  const selectedImage = galleryImages[selectedIndex];
  return <section aria-label="Product image gallery" className="space-y-3"><div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{selectedImage && !imageFailed ? <img className="h-full w-full object-contain p-6 transition-opacity duration-300 sm:p-10" src={selectedImage} alt={variantName ? `${productName} — ${variantName}` : productName} onError={() => setImageFailed(true)} /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-6 text-center text-sm font-medium text-slate-500">Image unavailable</div>}</div>{galleryImages.length > 1 && <div aria-label="Product image thumbnails" className="flex gap-3 overflow-x-auto pb-1">{galleryImages.map((image, index) => <button aria-label={`View product image ${index + 1}`} aria-pressed={selectedIndex === index} className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${selectedIndex === index ? 'border-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`} key={image} onClick={() => { setSelectedIndex(index); setImageFailed(false); }} type="button"><img alt="" className="h-full w-full object-contain" src={image} onError={(event) => { event.currentTarget.style.display = 'none'; }} /></button>)}</div>}</section>;
}
