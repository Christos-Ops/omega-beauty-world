import type { CartRepository } from '../repositories/interfaces.js';
import type { Cart, CartItemInput } from '../types/index.js';

export class CartService {
  constructor(private cartRepo: CartRepository) {}

  async getOrCreateCart(cartId?: string, userId?: string | null): Promise<Cart> {
    if (cartId) {
      const existing = await this.cartRepo.findById(cartId);
      if (existing) return existing;
    }
    if (userId) {
      const userCart = await this.cartRepo.findByUserId(userId);
      if (userCart) return userCart;
    }
    return this.cartRepo.create(userId ?? null);
  }

  async getCart(cartId: string): Promise<Cart | null> {
    return this.cartRepo.findById(cartId);
  }

  async addItem(cartId: string, item: CartItemInput): Promise<Cart | null> {
    return this.cartRepo.addItem(cartId, item);
  }

  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart | null> {
    if (quantity < 1) return null;
    return this.cartRepo.updateItemQuantity(cartId, productId, quantity);
  }

  async removeItem(cartId: string, productId: string): Promise<Cart | null> {
    return this.cartRepo.removeItem(cartId, productId);
  }

  async clearCart(cartId: string): Promise<Cart | null> {
    return this.cartRepo.clear(cartId);
  }

  computeTotals(cart: Cart): {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    totalItems: number;
  } {
    const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, totalItems };
  }
}
