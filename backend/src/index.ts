import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import { getRuntimeConfig } from './config.js';
import { createRepositories } from './repositories/index.js';
import { ProductService } from './services/ProductService.js';
import { CartService } from './services/CartService.js';
import { OrderService } from './services/OrderService.js';
import { UserService } from './services/UserService.js';

import { createProductRoutes } from './routes/productRoutes.js';
import { createCartRoutes } from './routes/cartRoutes.js';
import { createOrderRoutes } from './routes/orderRoutes.js';
import { createUserRoutes } from './routes/userRoutes.js';

import { attachUser } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const config = getRuntimeConfig();
const app = express();

if (!process.env.DATABASE_URL) {
  console.warn('[config] DATABASE_URL not set. Falling back to in-memory repositories.');
}

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(attachUser);

// --- Dependency injection ---
const repos = createRepositories();
const productService = new ProductService(repos.products);
const cartService = new CartService(repos.carts);
const orderService = new OrderService(repos.orders, repos.carts);
const userService = new UserService(repos.users);

// --- Routes ---
app.use('/api/products', createProductRoutes(productService));
app.use('/api/cart', createCartRoutes(cartService));
app.use('/api/orders', createOrderRoutes(orderService));
app.use('/api/users', createUserRoutes(userService));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`\n  Omega Beauty World API`);
  console.log(`  Listening on http://localhost:${config.port}`);
  console.log(`  CORS origin: ${config.clientOrigin}\n`);
});
