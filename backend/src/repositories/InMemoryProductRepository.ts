import type { Product, ProductRepository } from './interfaces.js';
import { seedProducts } from '../data/seed.js';

// In-memory product repository — swap for SqlProductRepository when Azure SQL
// is connected. The interface stays the same.
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [...seedProducts];

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    if (category === 'All') return [...this.products];
    return this.products.filter((p) => p.category === category);
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = { ...product, id };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: string, patch: Partial<Product>): Promise<Product | null> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...patch, id };
    return this.products[idx];
  }

  async delete(id: string): Promise<boolean> {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < before;
  }
}
