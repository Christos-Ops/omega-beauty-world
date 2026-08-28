import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import RatingStars from '@/components/RatingStars';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-royal-900">Product not found</h1>
        <Link to="/catalog" className="btn-gold mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity);
    setShowToast(true);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-royal-400">
        <Link to="/" className="hover:text-royal-700">Home</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-royal-700">Catalog</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category}`} className="hover:text-royal-700">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-royal-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-3xl border border-royal-100 bg-white">
            <img
              src={product.gallery[activeImage]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="mt-4 flex gap-3">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === i ? 'border-gold-400' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-20 w-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-gold-600">
            {product.brand}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-royal-900">
            {product.name}
          </h1>

          <div className="mt-4">
            <RatingStars rating={product.rating} reviews={product.reviews} />
          </div>

          <p className="mt-6 text-lg leading-relaxed text-royal-600">
            {product.description}
          </p>

          <div className="mt-6 rounded-2xl bg-royal-50 p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-royal-400">
              Key Ingredients
            </h3>
            <p className="mt-2 text-sm text-royal-700">{product.ingredients}</p>
          </div>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-serif text-4xl font-semibold text-royal-900">
              ${product.price}
            </span>
            <span className="text-sm text-royal-400">Free shipping over $75</span>
          </div>

          {/* Quantity + Actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-full border border-royal-200 bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-royal-600 hover:text-gold-600"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-royal-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center text-royal-600 hover:text-gold-600"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button onClick={handleAdd} className="btn-outline flex-1">
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-gold flex-1">
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-royal-100 pt-6">
            {[
              { label: 'Authentic' },
              { label: 'Cruelty-Free' },
              { label: 'Secure Checkout' },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-sm text-royal-600">
                <Check className="h-4 w-4 text-gold-500" /> {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {showToast && (
        <Toast message={`${product.name} added to cart`} onDone={() => setShowToast(false)} />
      )}
    </div>
  );
}
