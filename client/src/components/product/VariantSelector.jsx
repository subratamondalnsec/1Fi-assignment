const variantAttributes = [
  { key: 'storage', label: 'Storage' },
  { key: 'color', label: 'Color' },
];

export function VariantSelector({ variants, selectedVariant, onSelect }) {
  const availableAttributes = variantAttributes.filter(({ key }) => variants.some((variant) => typeof variant[key] === 'string' && variant[key].trim()));

  if (!availableAttributes.length) return null;

  function selectAttribute(attribute, value) {
    const otherAttributes = availableAttributes.filter(({ key }) => key !== attribute);
    const matchingVariant = variants.find((variant) => variant[attribute] === value && otherAttributes.every(({ key }) => !selectedVariant[key] || variant[key] === selectedVariant[key])) || variants.find((variant) => variant[attribute] === value);
    if (matchingVariant) onSelect(matchingVariant);
  }

  return <div className="space-y-5">{availableAttributes.map(({ key, label }) => {
    const values = [...new Set(variants.map((variant) => variant[key]).filter(Boolean))];
    return <fieldset key={key}><legend className="text-sm font-semibold text-slate-900">{label}: <span className="font-normal text-slate-600">{selectedVariant[key] || 'Not specified'}</span></legend><div className="mt-2 flex flex-wrap gap-2">{values.map((value) => <button aria-pressed={selectedVariant[key] === value} className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${selectedVariant[key] === value ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'}`} key={value} onClick={() => selectAttribute(key, value)} type="button">{value}</button>)}</div></fieldset>;
  })}</div>;
}
