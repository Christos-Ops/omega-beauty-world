import { Router } from 'express';
import type { ProductService } from '../services/ProductService.js';
import { createProductController } from '../controllers/productController.js';

export function createProductRoutes(productService: ProductService): Router {
  const router = Router();
  const ctrl = createProductController(productService);

  router.get('/', ctrl.getAll);
  router.get('/:id', ctrl.getById);
  router.post('/', ctrl.create);
  router.patch('/:id', ctrl.update);
  router.delete('/:id', ctrl.delete);

  return router;
}
