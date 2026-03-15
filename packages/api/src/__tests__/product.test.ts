import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import * as productsController from '../controllers/products.controller';
import { prisma } from '../config/database';
import * as slugService from '../services/slug.service';
import * as imageService from '../services/image.service';

// Mocking Dependencies
vi.mock('../config/database', () => {
  const mockPrisma = {
    $transaction: vi.fn((callback) => callback(mockPrisma)),
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    category: {
      findFirst: vi.fn(),
    },
    categoryAttribute: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    productAttributeValue: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    productAttributeMultiValue: {
      createMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    productImage: {
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    business: {
      findUnique: vi.fn(),
    }
  };
  return { prisma: mockPrisma };
});

vi.mock('../services/slug.service', () => ({
  createUniqueSlug: vi.fn().mockResolvedValue('test-product-slug'),
}));

vi.mock('../services/image.service', () => ({
  uploadImage: vi.fn().mockResolvedValue({ url: 'http://test.com/image.jpg', publicId: 'test-id' }),
  deleteImage: vi.fn().mockResolvedValue(true),
}));

describe('Products Controller Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      user: { business_id: 'test-business-id' } as any,
      body: {},
      params: {},
      files: [],
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    nextFunction = vi.fn();
  });

  describe('createProduct', () => {
    it('should create a product with valid data', async () => {
      mockRequest.body = {
        name: 'iPhone 15',
        category_id: 'cat-1',
        attributes: []
      };

      (prisma.category.findFirst as any).mockResolvedValue({ id: 'cat-1', business_id: 'test-business-id' });
      (prisma.categoryAttribute.findMany as any).mockResolvedValue([]); // No required attributes
      (prisma.product.create as any).mockResolvedValue({ id: 'prod-1', name: 'iPhone 15', slug: 'test-product-slug' });

      await productsController.createProduct(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ name: 'iPhone 15' })
      }));
    });

    it('should throw 400 if a required attribute is missing', async () => {
      mockRequest.body = {
        name: 'iPhone 15',
        category_id: 'cat-1',
        attributes: [] // Missing required 'Brand'
      };

      (prisma.category.findFirst as any).mockResolvedValue({ id: 'cat-1', business_id: 'test-business-id' });
      (prisma.categoryAttribute.findMany as any).mockResolvedValue([
        { id: 'attr-1', name: 'Brand', is_required: true, type: 'text' }
      ]);

      await productsController.createProduct(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: '"Brand" özelliği zorunludur.'
      }));
    });
  });

  describe('uploadProductImages', () => {
    it('should enforce business-level image limits', async () => {
      mockRequest.params = { id: 'prod-1' };
      mockRequest.files = [{}, {}] as any; // 2 files
      
      (prisma.product.findFirst as any).mockResolvedValue({ 
        id: 'prod-1', 
        images: [{}, {}, {}] // Already has 3 images
      });
      (prisma.business.findUnique as any).mockResolvedValue({ max_images_per_product: 4 });

      await productsController.uploadProductImages(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 400,
        message: 'Bu işletme için ürün başına en fazla 4 görsel yüklenebilir.'
      }));
    });
  });

  describe('deleteProduct', () => {
    it('should delete images from Cloudinary and then the product from DB', async () => {
      mockRequest.params = { id: 'prod-1' };
      (prisma.product.findFirst as any).mockResolvedValue({
        id: 'prod-1',
        images: [{ public_id: 'img-1' }, { public_id: 'img-2' }]
      });

      await productsController.deleteProduct(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(imageService.deleteImage).toHaveBeenCalledTimes(2);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'prod-1' } });
    });
  });
});
