import { v4 as uuidv4 } from 'uuid';
import type { Cart, CartItemInput, CartRepository } from './interfaces.js';
import type { CartItem, Product } from '../types/index.js';

// In-memory cart repository. When Azure SQL is connected, carts can be stored
// as a Cart table with a CartItems child table, or as JSON column.
export class InMemoryCartRepository implements CartRepository {
  private carts = new Map<string, Cart>();
  private productLookup: (productId: string) => Promise<Product | null>;

  // Product lookup is injected so the cart can hydrate item details at add time.
  constructor(productLookup: (productId: string) => Promise<Product | null>) {
    this.productLookup = productLookup;
  }

  async findById(id: string): Promise<Cart | null> {
    return this.carts.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    for (const cart of this.carts.values()) {
      if (cart.userId === userId) return cart;
    }
    return null;
  }

  async create(userId: string | null): Promise<Cart> {
    const now = new Date().toISOString();
    const cart: Cart = {
      id: uuidv4(),
      userId,
      items: [],
      createdAt: now,
      updatedAt: now,
    };
    this.carts.set(cart.id, cart);
    return cart;
  }

  async addItem(cartId: string, item: CartItemInput): Promise<Cart | null> {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    const product = await this.productLookup(item.productId);
    if (!product) return null;

    const existing = cart.items.find((i: CartItem) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      };
      cart.items.push(newItem);
    }

    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null> {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    const item = cart.items.find((i: CartItem) => i.productId === productId);
    if (!item) return null;

    item.quantity = quantity;
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  async removeItem(cartId: string, productId: string): Promise<Cart | null> {
    const cart = this.carts.get(cartId);
    if (!cart) return null;

    cart.items = cart.items.filter((i: CartItem) => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  async clear(cartId: string): Promise<Cart | null> {
    const cart = this.carts.get(cartId);
    if (!cart) return null;
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  async delete(cartId: string): Promise<boolean> {
    return this.carts.delete(cartId);
  }
}
