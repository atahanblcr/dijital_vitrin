import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { prisma } from '../config/database';

// Prisma'yı mock'luyoruz
vi.mock('../config/database', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    categoryAttribute: {
      findMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    attributeOption: {
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

describe('Categories Controller Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      user: { business_id: 'test-business-id', id: 'user-1', username: 'testuser', role: 'business_admin' } as any,
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    nextFunction = vi.fn();
  });

  describe('getCategories', () => {
    it('should return categories for the business', async () => {
      const mockCategories = [{ id: 'cat-1', name: 'Elektronik', business_id: 'test-business-id' }];
      (prisma.category.findMany as any).mockResolvedValue(mockCategories);

      await categoriesController.getCategories(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(prisma.category.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { business_id: 'test-business-id' }
      }));
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockCategories });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      mockRequest.body = { name: 'Yeni Kategori', sort_order: 1 };
      const mockNewCategory = { id: 'cat-2', ...mockRequest.body, business_id: 'test-business-id' };
      (prisma.category.create as any).mockResolvedValue(mockNewCategory);

      await categoriesController.createCategory(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockNewCategory });
    });

    it('should throw 403 if businessId is missing', async () => {
      mockRequest.user = undefined;
      await categoriesController.createCategory(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });
  });

  describe('createAttribute', () => {
    it('should add an attribute to a category', async () => {
      mockRequest.params = { id: 'cat-1' };
      mockRequest.body = { name: 'Renk', type: 'select', is_required: true };
      
      (prisma.category.findFirst as any).mockResolvedValue({ id: 'cat-1', business_id: 'test-business-id' });
      (prisma.categoryAttribute.create as any).mockResolvedValue({ id: 'attr-1', ...mockRequest.body });

      await categoriesController.createAttribute(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ name: 'Renk' })
      }));
    });
  });
});
