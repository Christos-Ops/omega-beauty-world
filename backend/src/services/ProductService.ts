import type { ProductRepository } from '../repositories/interfaces.js';
import type { Product } from '../types/index.js';

export class ProductService {
  constructor(private productRepo: ProductRepository) {}

  async getAllProducts(filters?: {
    category?: string;
    search?: string;
    maxPrice?: number;
    sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  }): Promise<Product[]> {
    let products: Product[];

    if (filters?.category && filters.category !== 'All') {
      products = await this.productRepo.findByCategory(filters.category);
    } else {
      products = await this.productRepo.findAll();
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (filters?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepo.findById(id);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.productRepo.create(product);
  }

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
    return this.productRepo.update(id, patch);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepo.delete(id);
  }
}
