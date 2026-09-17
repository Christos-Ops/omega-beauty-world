import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-royal-200 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-royal-300" strokeWidth={1} />
          <h1 className="mt-6 font-serif text-3xl font-semibold text-royal-900">
            Your cart is empty
          </h1>
          <p className="mt-2 max-w-sm text-royal-500">
            Looks like you haven’t added anything yet. Explore our collection and find
            your next beauty essential.
          </p>
          <Link to="/catalog" className="btn-gold mt-8">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="eyebrow">Shopping Bag</p>
      <h1 className="section-title mt-2">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-royal-100 bg-white p-4"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="h-28 w-24 shrink-0 overflow-hidden rounded-xl"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
                        {item.product.brand}
                      </p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-serif text-lg font-semibold text-royal-900 hover:text-gold-600">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-royal-400">{item.product.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-royal-300 hover:text-rose-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-royal-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-royal-600 hover:text-gold-600"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-royal-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center text-royal-600 hover:text-gold-600"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-serif text-xl font-semibold text-royal-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-royal-100 bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-royal-900">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-royal-600">
                <span>Subtotal</span>
                <span className="font-medium text-royal-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-royal-600">
                <span>Shipping</span>
                <span className="font-medium text-royal-900">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-royal-600">
                <span>Estimated Tax</span>
                <span className="font-medium text-royal-900">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-royal-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-serif text-lg font-semibold text-royal-900">Total</span>
                  <span className="font-serif text-lg font-semibold text-royal-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="btn-gold mt-6 w-full">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/catalog"
              className="mt-3 block text-center text-sm text-royal-500 hover:text-gold-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
