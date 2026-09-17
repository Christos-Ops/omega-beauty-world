import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { apiFetch } from '@/lib/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await apiFetch<{ products: Product[] }>('/api/products');
        if (!active) return;
        setProducts(result.products ?? []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}
