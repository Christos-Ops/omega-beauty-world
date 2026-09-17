import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import type { OrderService } from '../services/OrderService.js';
import { notFound, badRequest } from '../utils/errors.js';

export function createOrderController(orderService: OrderService) {
  return {
    // GET /api/orders
    getAll: asyncHandler(async (_req: Request, res: Response) => {
      const orders = await orderService.getAllOrders();
      res.json({ orders, count: orders.length });
    }),

    // GET /api/orders/:id
    getById: asyncHandler(async (req: Request, res: Response) => {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) throw notFound('Order not found');
      res.json({ order });
    }),

    // GET /api/orders/user/:userId
    getByUser: asyncHandler(async (req: Request, res: Response) => {
      const orders = await orderService.getOrdersByUser(req.params.userId);
      res.json({ orders, count: orders.length });
    }),

    // POST /api/orders
    create: asyncHandler(async (req: Request, res: Response) => {
      const { cartId, email, shippingAddress } = req.body;

      if (!cartId) throw badRequest('cartId is required');
      if (!email || !email.includes('@')) throw badRequest('valid email is required');
      if (!shippingAddress) throw badRequest('shippingAddress is required');

      const required = ['firstName', 'lastName', 'address', 'city', 'zip', 'country'];
      for (const field of required) {
        if (!shippingAddress[field]?.trim()) {
          throw badRequest(`shippingAddress.${field} is required`);
        }
      }

      const userId = req.user?.id ?? null;
      const order = await orderService.createOrder({
        cartId,
        email,
        userId,
        shippingAddress,
      });

      if (!order) throw badRequest('Cart is empty or not found');
      res.status(201).json({ order });
    }),

    // PATCH /api/orders/:id/status
    updateStatus: asyncHandler(async (req: Request, res: Response) => {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw badRequest('Invalid status');
      }

      const order = await orderService.updateOrderStatus(req.params.id, status);
      if (!order) throw notFound('Order not found');
      res.json({ order });
    }),
  };
}
