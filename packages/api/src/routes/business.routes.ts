import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import * as productsController from '../controllers/products.controller';
import * as blogController from '../controllers/blog.controller';
import { validate } from '../middleware/validate';
import { authenticate, requireBusinessAdmin } from '../middleware/auth';
import {
  createCategorySchema,
  updateCategorySchema,
  createAttributeSchema,
  updateAttributeSchema,
  createOptionSchema,
} from '../validators/category.validator';
import {
  createProductSchema,
  updateProductSchema,
  toggleProductSchema,
} from '../validators/product.validator';
import {
  createBlogSchema,
  updateBlogSchema,
} from '../validators/blog.validator';
import { upload } from '../services/image.service';

const router = Router();

// Bütün işletme rotaları için kimlik ve rol (İşletme Admini veya Süper Admin) zorunludur
router.use(authenticate, requireBusinessAdmin);

// ─── Kategori Rotaları ───
router.get('/categories', categoriesController.getCategories);
router.post('/categories', validate(createCategorySchema), categoriesController.createCategory);
router.put('/categories/:id', validate(updateCategorySchema), categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

// ─── Kategori Özellik Rotaları ───
router.get('/categories/:id/attributes', categoriesController.getAttributes);
router.post('/categories/:id/attributes', validate(createAttributeSchema), categoriesController.createAttribute);
router.put('/categories/:id/attributes/:attrId', validate(updateAttributeSchema), categoriesController.updateAttribute);
router.delete('/categories/:id/attributes/:attrId', categoriesController.deleteAttribute);

// ─── Seçenek (Option) Rotaları ───
router.post('/categories/:id/attributes/:attrId/options', validate(createOptionSchema), categoriesController.createOption);
router.delete('/categories/:id/attributes/:attrId/options/:optId', categoriesController.deleteOption);

// ─── Ürün Rotaları ───
router.get('/products', productsController.getProducts);
router.post('/products', validate(createProductSchema), productsController.createProduct);
// Update ve diğer toggle rotaları eklenecek
router.delete('/products/:id', productsController.deleteProduct);

// Görsel Yükleme (Multer middleware'i ile max 10 dosya)
router.post('/products/:id/images', upload.array('images', 10), productsController.uploadProductImages);
router.delete('/products/:id/images/:imgId', productsController.deleteProductImage);

// ─── Blog Rotaları ───
router.get('/blog', blogController.getBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.post('/blog', validate(createBlogSchema), blogController.createBlog);
router.put('/blog/:id', validate(updateBlogSchema), blogController.updateBlog);
router.delete('/blog/:id', blogController.deleteBlog);

export default router;
