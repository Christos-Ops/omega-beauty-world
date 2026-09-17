import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import type { Category, Product } from '@/types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as Category | 'All') || 'All';
  const [sort, setSort] = useState<SortKey>('featured');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(250);
  const { products, loading, error } = useProducts();

  const setCategory = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Reset search when category changes via URL
  useEffect(() => {
    setSearch('');
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let result: Product[] = [...products];

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    result = result.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [activeCategory, search, sort, maxPrice]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-serif text-2xl text-royal-900">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-serif text-2xl text-royal-900">We couldn’t load the catalog.</p>
        <p className="mt-2 text-royal-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow">The Collection</p>
        <h1 className="section-title mt-2">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h1>
        <p className="mt-2 text-royal-500">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-royal-700">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-royal-400">
                Category
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeCategory === cat
                        ? 'bg-royal-900 font-medium text-royal-50'
                        : 'text-royal-600 hover:bg-royal-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-royal-400">
                Max Price
              </h3>
              <input
                type="range"
                min={20}
                max={250}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="mt-1 flex justify-between text-xs text-royal-400">
                <span>$20</span>
                <span className="font-semibold text-royal-700">${maxPrice}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-royal-200 bg-white px-4 py-3 text-sm text-royal-700 focus:border-gold-400 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-royal-200 py-20 text-center">
              <p className="font-serif text-2xl text-royal-700">No products found</p>
              <p className="mt-2 text-royal-400">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
