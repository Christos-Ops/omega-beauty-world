export type {
  Product,
  Cart,
  Order,
  User,
  CartItemInput,
  OrderItem,
  OrderShippingAddress,
} from '../types/index.js';
import type {
  Product,
  Cart,
  Order,
  User,
  CartItemInput,
} from '../types/index.js';

// Repository interfaces — the service layer depends on these, not the concrete
// implementation. When Azure SQL is connected, create a SqlXxxRepository that
// implements each interface; the services and controllers stay unchanged.

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export interface CartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  create(userId: string | null): Promise<Cart>;
  addItem(cartId: string, item: CartItemInput): Promise<Cart | null>;
  updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<Cart | null>;
  removeItem(cartId: string, productId: string): Promise<Cart | null>;
  clear(cartId: string): Promise<Cart | null>;
  delete(cartId: string): Promise<boolean>;
}

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id' | 'createdAt' | 'orderNumber'>): Promise<Order>;
  updateStatus(id: string, status: Order['status']): Promise<Order | null>;
}

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}
