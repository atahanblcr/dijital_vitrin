import { Router } from 'express';
import * as storefrontController from '../controllers/storefront.controller';

const router = Router();

// Herkese açık vitrin rotaları
router.get('/:slug', storefrontController.getBusinessBySlug);
router.get('/:slug/products', storefrontController.getProducts);
router.get('/:slug/products/:productSlug', storefrontController.getProductBySlug);
router.get('/:slug/blog', storefrontController.getBlogsBySlug);

export default router;
