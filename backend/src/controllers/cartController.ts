import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import type { CartService } from '../services/CartService.js';
import { notFound, badRequest } from '../utils/errors.js';

export function createCartController(cartService: CartService) {
  return {
    // GET /api/cart/:cartId
    getCart: asyncHandler(async (req: Request, res: Response) => {
      const cart = await cartService.getCart(req.params.cartId);
      if (!cart) throw notFound('Cart not found');
      const totals = cartService.computeTotals(cart);
      res.json({ cart, totals });
    }),

    // POST /api/cart  (creates a new cart, or returns existing by cartId/userId)
    createCart: asyncHandler(async (req: Request, res: Response) => {
      const { cartId } = req.body;
      const userId = req.user?.id ?? null;
      const cart = await cartService.getOrCreateCart(cartId, userId);
      const totals = cartService.computeTotals(cart);
      res.status(201).json({ cart, totals });
    }),

    // POST /api/cart/:cartId/items
    addItem: asyncHandler(async (req: Request, res: Response) => {
      const { productId, quantity } = req.body;
      if (!productId) throw badRequest('productId is required');
      if (!quantity || quantity < 1) throw badRequest('quantity must be >= 1');

      const cart = await cartService.addItem(req.params.cartId, { productId, quantity });
      if (!cart) throw notFound('Cart or product not found');
      const totals = cartService.computeTotals(cart);
      res.json({ cart, totals });
    }),

    // PATCH /api/cart/:cartId/items/:productId
    updateItem: asyncHandler(async (req: Request, res: Response) => {
      const { quantity } = req.body;
      if (!quantity || quantity < 1) throw badRequest('quantity must be >= 1');

      const cart = await cartService.updateItemQuantity(
        req.params.cartId,
        req.params.productId,
        quantity,
      );
      if (!cart) throw notFound('Cart or item not found');
      const totals = cartService.computeTotals(cart);
      res.json({ cart, totals });
    }),

    // DELETE /api/cart/:cartId/items/:productId
    removeItem: asyncHandler(async (req: Request, res: Response) => {
      const cart = await cartService.removeItem(req.params.cartId, req.params.productId);
      if (!cart) throw notFound('Cart not found');
      const totals = cartService.computeTotals(cart);
      res.json({ cart, totals });
    }),

    // DELETE /api/cart/:cartId
    clearCart: asyncHandler(async (req: Request, res: Response) => {
      const cart = await cartService.clearCart(req.params.cartId);
      if (!cart) throw notFound('Cart not found');
      const totals = cartService.computeTotals(cart);
      res.json({ cart, totals });
    }),
  };
}
