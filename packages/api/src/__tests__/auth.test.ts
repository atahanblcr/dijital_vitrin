import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';

describe('Auth API Integration Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if credentials are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401/404 for invalid credentials', async () => {
      // Mocking service to return a real AppError instance
      const loginMock = vi.spyOn(authService, 'loginUser').mockRejectedValue(
        new AppError(401, 'Geçersiz kullanıcı adı veya şifre')
      );

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wrong', password: 'wrongpassword' });
      
      expect(res.statusCode).toBe(401);
      loginMock.mockRestore();
    });
  });
});
