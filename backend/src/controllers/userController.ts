import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import type { UserService } from '../services/UserService.js';
import { badRequest } from '../utils/errors.js';

export function createUserController(userService: UserService) {
  return {
    // POST /api/users/register
    register: asyncHandler(async (req: Request, res: Response) => {
      const { firstName, lastName, email, password } = req.body;

      if (!firstName?.trim()) throw badRequest('firstName is required');
      if (!lastName?.trim()) throw badRequest('lastName is required');
      if (!email?.includes('@')) throw badRequest('valid email is required');
      if (!password || password.length < 6) throw badRequest('password must be at least 6 characters');

      const result = await userService.register({ firstName, lastName, email, password });
      res.status(201).json(result);
    }),

    // POST /api/users/login
    login: asyncHandler(async (req: Request, res: Response) => {
      const { email, password } = req.body;

      if (!email?.includes('@')) throw badRequest('valid email is required');
      if (!password) throw badRequest('password is required');

      const result = await userService.login(email, password);
      res.json(result);
    }),

    // GET /api/users/me  (requires auth via requireAuth middleware)
    getMe: asyncHandler(async (req: Request, res: Response) => {
      if (!req.user) throw badRequest('Not authenticated');
      const user = await userService.getUserById(req.user.id);
      res.json({ user });
    }),
  };
}
