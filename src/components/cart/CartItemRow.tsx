import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatBDT } from '../../utils/formatters';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (newQty: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const product = item.product;
  const unitPrice = item.priceAtAddition;
  const lineTotal = unitPrice * item.quantity;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Product Image & Meta */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link to={`/product/${product.slug}`} className="shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-2xl bg-slate-100 border border-slate-100 shadow-sm"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            {product.category}
          </span>
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate"
          >
            {product.name}
          </Link>

          {/* Variants */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
            {item.selectedSize && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                Size: {item.selectedSize}
              </span>
            )}
            {item.selectedColor && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                  style={{ backgroundColor: item.selectedColor.hex }}
                />
                {item.selectedColor.name}
              </span>
            )}
          </div>

          <div className="mt-1 text-xs font-semibold text-slate-600 sm:hidden">
            Unit Price: {formatBDT(unitPrice)}
          </div>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="px-3 py-2 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-800">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= product.stock || isOutOfStock}
            className="px-3 py-2 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[90px]">
          <div className="text-base font-extrabold text-slate-900">
            {formatBDT(lineTotal)}
          </div>
          {product.discountPrice && (
            <div className="text-xs text-slate-400 line-through">
              {formatBDT(product.price * item.quantity)}
            </div>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Remove from cart"
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
