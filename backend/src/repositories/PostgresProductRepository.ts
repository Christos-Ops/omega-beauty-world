import { Pool } from 'pg';
import type { Product, ProductRepository } from './interfaces.js';

type ProductRow = {
  id: string;
  name: string;
  brand: string;
  category: Product['category'];
  price: string | number;
  rating: string | number;
  reviews: string | number;
  image: string;
  gallery: string[] | null;
  description: string;
  ingredients: string;
  badge?: Product['badge'];
};

export class PostgresProductRepository implements ProductRepository {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async findAll(): Promise<Product[]> {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url as "image",
          gallery,
          description,
          ingredients,
          badge
        FROM products
        ORDER BY created_at DESC
      `,
    );

    return rows.map((row: ProductRow) => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description,
      ingredients: row.ingredients,
      badge: row.badge ?? undefined,
    }));
  }

  async findById(id: string): Promise<Product | null> {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url as "image",
          gallery,
          description,
          ingredients,
          badge
        FROM products
        WHERE id = $1
      `,
      [id],
    );

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description,
      ingredients: row.ingredients,
      badge: row.badge ?? undefined,
    };
  }

  async findByCategory(category: string): Promise<Product[]> {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url as "image",
          gallery,
          description,
          ingredients,
          badge
        FROM products
        WHERE category = $1
        ORDER BY created_at DESC
      `,
      [category],
    );

    return rows.map((row: ProductRow) => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description,
      ingredients: row.ingredients,
      badge: row.badge ?? undefined,
    }));
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const nextId = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { rows } = await this.pool.query(
      `
        INSERT INTO products (
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url,
          gallery,
          description,
          ingredients,
          badge
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url as "image",
          gallery,
          description,
          ingredients,
          badge
      `,
      [
        nextId,
        product.name,
        product.brand,
        product.category,
        product.price,
        product.rating,
        product.reviews,
        product.image,
        JSON.stringify(product.gallery ?? []),
        product.description,
        product.ingredients,
        product.badge ?? null,
      ],
    );

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description,
      ingredients: row.ingredients,
      badge: row.badge ?? undefined,
    };
  }

  async update(id: string, patch: Partial<Product>): Promise<Product | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged: Product = { ...existing, ...patch, id };

    const { rows } = await this.pool.query(
      `
        UPDATE products
        SET
          name = $2,
          brand = $3,
          category = $4,
          price = $5,
          rating = $6,
          reviews = $7,
          image_url = $8,
          gallery = $9,
          description = $10,
          ingredients = $11,
          badge = $12,
          updated_at = NOW()
        WHERE id = $1
        RETURNING
          id,
          name,
          brand,
          category,
          price,
          rating,
          reviews,
          image_url as "image",
          gallery,
          description,
          ingredients,
          badge
      `,
      [
        id,
        merged.name,
        merged.brand,
        merged.category,
        merged.price,
        merged.rating,
        merged.reviews,
        merged.image,
        JSON.stringify(merged.gallery ?? []),
        merged.description,
        merged.ingredients,
        merged.badge ?? null,
      ],
    );

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      rating: Number(row.rating),
      reviews: Number(row.reviews),
      image: row.image,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      description: row.description,
      ingredients: row.ingredients,
      badge: row.badge ?? undefined,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
