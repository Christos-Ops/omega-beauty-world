import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/errors.js';

// Centralized error handler — converts thrown errors into JSON responses.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err instanceof Error) {
    // Service-layer business errors (e.g. "email already exists")
    if (err.message.includes('already exists') || err.message.includes('Invalid email or password')) {
      res.status(err.message.includes('already exists') ? 409 : 401).json({ error: err.message });
      return;
    }
    if (err.message === 'Authentication required') {
      res.status(401).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
