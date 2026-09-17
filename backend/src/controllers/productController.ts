import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import type { ProductService } from '../services/ProductService.js';
import { notFound, badRequest } from '../utils/errors.js';

export function createProductController(productService: ProductService) {
  return {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { category, search, sort } = req.query;
      const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

      if (maxPrice !== undefined && isNaN(maxPrice)) {
        throw badRequest('maxPrice must be a number');
      }

      const products = await productService.getAllProducts({
        category: category as string | undefined,
        search: search as string | undefined,
        maxPrice,
        sort: sort as 'featured' | 'price-asc' | 'price-desc' | 'rating' | undefined,
      });

      res.json({ products, count: products.length });
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
      const product = await productService.getProductById(req.params.id);
      if (!product) throw notFound(`Product '${req.params.id}' not found`);
      res.json({ product });
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ product });
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) throw notFound(`Product '${req.params.id}' not found`);
      res.json({ product });
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
      const deleted = await productService.deleteProduct(req.params.id);
      if (!deleted) throw notFound(`Product '${req.params.id}' not found`);
      res.status(204).send();
    }),
  };
}
