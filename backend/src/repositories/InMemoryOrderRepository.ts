import { v4 as uuidv4 } from 'uuid';
import type { Order, OrderRepository } from './interfaces.js';

// In-memory order repository. When Azure SQL is connected, orders map to an
// Orders table with an OrderItems child table.
export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.userId === userId);
  }

  async create(order: Omit<Order, 'id' | 'createdAt' | 'orderNumber'>): Promise<Order> {
    const id = uuidv4();
    const orderNumber = `OBW-${Math.floor(Math.random() * 900000 + 100000)}`;
    const newOrder: Order = {
      ...order,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  }
}
