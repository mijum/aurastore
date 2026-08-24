import React from 'react';

interface VariantSelectorProps {
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  onSizeChange: (size: string) => void;
  onColorChange: (color: { name: string; hex: string }) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span>Choose Size</span>
            <span className="text-indigo-600 font-semibold">{selectedSize || 'Select'}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`min-w-[44px] h-10 px-3.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors && colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span>Choose Color</span>
            <span className="text-indigo-600 font-semibold">{selectedColor?.name || 'Select'}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor?.name === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/25 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-full h-full rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
