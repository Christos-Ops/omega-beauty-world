import { Router } from 'express';
import type { OrderService } from '../services/OrderService.js';
import { createOrderController } from '../controllers/orderController.js';

export function createOrderRoutes(orderService: OrderService): Router {
  const router = Router();
  const ctrl = createOrderController(orderService);

  router.get('/', ctrl.getAll);
  router.get('/user/:userId', ctrl.getByUser);
  router.get('/:id', ctrl.getById);
  router.post('/', ctrl.create);
  router.patch('/:id/status', ctrl.updateStatus);

  return router;
}
