import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import * as blogController from '../controllers/blog.controller';
import { prisma } from '../config/database';
import * as slugService from '../services/slug.service';

// Mocking Dependencies
vi.mock('../config/database', () => ({
  prisma: {
    blogPost: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

vi.mock('../services/slug.service', () => ({
  createUniqueSlug: vi.fn().mockResolvedValue('test-blog-slug'),
}));

describe('Blog Controller Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {
      user: { business_id: 'test-business-id' } as any,
      body: {},
      params: {},
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    nextFunction = vi.fn();
  });

  describe('createBlog', () => {
    it('should create a blog post with valid data', async () => {
      mockRequest.body = {
        title: '2025 Yaz Modası',
        content: '<p>Yaz geldi!</p>',
        status: 'published'
      };

      (prisma.blogPost.create as any).mockResolvedValue({ id: 'blog-1', ...mockRequest.body, slug: 'test-blog-slug' });

      await blogController.createBlog(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ title: '2025 Yaz Modası' })
      }));
    });
  });

  describe('updateBlog', () => {
    it('should update an existing blog post', async () => {
      mockRequest.params = { id: 'blog-1' };
      mockRequest.body = { title: 'Yeni Başlık' };
      
      (prisma.blogPost.findFirst as any).mockResolvedValue({ id: 'blog-1', title: 'Eski Başlık', business_id: 'test-business-id' });
      (prisma.blogPost.update as any).mockResolvedValue({ id: 'blog-1', title: 'Yeni Başlık' });

      await blogController.updateBlog(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(prisma.blogPost.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ title: 'Yeni Başlık' })
      }));
    });

    it('should throw 404 if blog post does not belong to the business', async () => {
      mockRequest.params = { id: 'blog-other' };
      (prisma.blogPost.findFirst as any).mockResolvedValue(null); // Not found or different business

      await blogController.updateBlog(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
  });
});
