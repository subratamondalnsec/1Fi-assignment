import { getAvailableStorages, getAvailableColors } from '../../utils/variantResolver';

export function VariantSelector({ variants, selectedStorage, selectedColor, onStorageChange, onColorChange }) {
  const storages = getAvailableStorages(variants);
  const colors = getAvailableColors(variants);

  if (!storages.length && !colors.length) return null;

  return <div className="space-y-5">
    {storages.length > 0 && <fieldset>
      <legend className="text-sm font-semibold text-slate-900">Storage: <span className="font-normal text-slate-600">{selectedStorage || 'Not specified'}</span></legend>
      <div className="mt-2 flex flex-wrap gap-2">{storages.map((storage) => {
        const isSelected = selectedStorage === storage;
        return <button
          key={storage}
          onClick={() => onStorageChange(storage)}
          type="button"
          aria-pressed={isSelected}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isSelected
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400 cursor-pointer'
          }`}
        >
          {storage}
        </button>;
      })}</div>
    </fieldset>}
    {colors.length > 0 && <fieldset>
      <legend className="text-sm font-semibold text-slate-900">Color: <span className="font-normal text-slate-600">{selectedColor || 'Not specified'}</span></legend>
      <div className="mt-2 flex flex-wrap gap-2">{colors.map((color) => {
        const isSelected = selectedColor === color;
        return <button
          key={color}
          onClick={() => onColorChange(color)}
          type="button"
          aria-pressed={isSelected}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isSelected
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400 cursor-pointer'
          }`}
        >
          {color}
        </button>;
      })}</div>
    </fieldset>}
  </div>;
}
