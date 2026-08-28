import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const badgeColors: Record<string, string> = {
    Bestseller: 'bg-gold-400 text-royal-950',
    New: 'bg-royal-700 text-royal-50',
    Limited: 'bg-rose-600 text-white',
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-royal-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-royal-200/40">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeColors[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-serif text-lg font-semibold text-royal-900 hover:text-gold-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
          <span className="text-sm font-medium text-royal-700">{product.rating}</span>
          <span className="text-xs text-royal-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-serif text-xl font-semibold text-royal-900">
            ${product.price}
          </span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-2 rounded-full bg-royal-900 px-4 py-2.5 text-xs font-medium text-royal-50 transition-all hover:bg-gold-400 hover:text-royal-950 active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
