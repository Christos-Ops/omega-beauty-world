import type { OrderRepository, CartRepository } from '../repositories/interfaces.js';
import type { Cart, Order, OrderItem, OrderShippingAddress } from '../types/index.js';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private cartRepo: CartRepository,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepo.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepo.findById(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async createOrder(input: {
    cartId: string;
    email: string;
    userId?: string | null;
    shippingAddress: OrderShippingAddress;
  }): Promise<Order | null> {
    const cart = await this.cartRepo.findById(input.cartId);
    if (!cart || cart.items.length === 0) return null;

    const items: OrderItem[] = cart.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      brand: i.brand,
      price: i.price,
      quantity: i.quantity,
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 75 ? 0 : 8;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const order = await this.orderRepo.create({
      userId: input.userId ?? null,
      email: input.email,
      items,
      shippingAddress: input.shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      status: 'confirmed',
    });

    // Clear the cart after order is placed
    await this.cartRepo.clear(input.cartId);

    return order;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    return this.orderRepo.updateStatus(id, status);
  }
}
