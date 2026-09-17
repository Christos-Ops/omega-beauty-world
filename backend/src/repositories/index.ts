import 'dotenv/config';
import type {
  ProductRepository,
  CartRepository,
  OrderRepository,
  UserRepository,
} from './interfaces.js';
import { InMemoryProductRepository } from './InMemoryProductRepository.js';
import { InMemoryCartRepository } from './InMemoryCartRepository.js';
import { InMemoryOrderRepository } from './InMemoryOrderRepository.js';
import { InMemoryUserRepository } from './InMemoryUserRepository.js';
import { PostgresProductRepository } from './PostgresProductRepository.js';

function isPostgresConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.DATABASE_URL && env.DATABASE_URL.trim().length > 0);
}

export function createRepositories(env: NodeJS.ProcessEnv = process.env): {
  products: ProductRepository;
  carts: CartRepository;
  orders: OrderRepository;
  users: UserRepository;
} {
  const usePostgres = isPostgresConfigured(env);

  const products = usePostgres
    ? new PostgresProductRepository(env.DATABASE_URL as string)
    : new InMemoryProductRepository();

  const carts = new InMemoryCartRepository(async (productId: string) => {
    return products.findById(productId);
  });
  const orders = new InMemoryOrderRepository();
  const users = new InMemoryUserRepository();

  return { products, carts, orders, users };
}
