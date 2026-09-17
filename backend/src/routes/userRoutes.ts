import { Router } from 'express';
import type { UserService } from '../services/UserService.js';
import { createUserController } from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

export function createUserRoutes(userService: UserService): Router {
  const router = Router();
  const ctrl = createUserController(userService);

  router.post('/register', ctrl.register);
  router.post('/login', ctrl.login);
  router.get('/me', requireAuth, ctrl.getMe);

  return router;
}
