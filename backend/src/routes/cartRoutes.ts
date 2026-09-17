import { Router } from 'express';
import type { CartService } from '../services/CartService.js';
import { createCartController } from '../controllers/cartController.js';

export function createCartRoutes(cartService: CartService): Router {
  const router = Router();
  const ctrl = createCartController(cartService);

  router.post('/', ctrl.createCart);
  router.get('/:cartId', ctrl.getCart);
  router.post('/:cartId/items', ctrl.addItem);
  router.patch('/:cartId/items/:productId', ctrl.updateItem);
  router.delete('/:cartId/items/:productId', ctrl.removeItem);
  router.delete('/:cartId', ctrl.clearCart);

  return router;
}
