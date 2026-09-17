import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRuntimeConfig } from '../config.js';
import type { UserPublic } from '../types/index.js';

// Augment Express Request to carry the authenticated user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserPublic;
    }
  }
}

export interface JwtPayload {
  sub: string;
  email: string;
}

// Verifies the Bearer token and attaches the decoded user to req.user.
// Does NOT block the request if no token is present — use requireAuth for
// routes that must be authenticated.
export function attachUser(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = header.slice(7);
  try {
    const { jwtSecret } = getRuntimeConfig();
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      firstName: '',
      lastName: '',
      createdAt: '',
    };
  } catch {
    // Invalid token — leave req.user undefined
  }
  next();
}

// Middleware that requires a valid auth token
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new Error('Authentication required'));
  } else {
    next();
  }
}
