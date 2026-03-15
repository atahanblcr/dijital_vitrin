import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatWhatsAppNumber } from '../../../shared/utils/whatsapp';
import { getSlugFromHostname, getSlugFromPathname } from '../../../shared/utils/subdomain';
import { createUniqueSlug } from '../services/slug.service';
import { prisma } from '../config/database';
import request from 'supertest';
import app from '../app';

// Mock Prisma for slug collision test
vi.mock('../config/database', () => ({
  prisma: {
    product: {
      findFirst: vi.fn(),
    },
  },
}));

describe('Critical Fixes & Safety Tests', () => {
  
  describe('1. WhatsApp Phone Number Formatting', () => {
    it('should clean spaces, dashes and parentheses', () => {
      expect(formatWhatsAppNumber('0 (555) 123-4567')).toBe('905551234567');
    });

    it('should add 90 if missing', () => {
      expect(formatWhatsAppNumber('5551234567')).toBe('905551234567');
    });

    it('should handle numbers already starting with 90', () => {
      expect(formatWhatsAppNumber('905551234567')).toBe('905551234567');
    });

    it('should handle leading zero and add 90', () => {
      expect(formatWhatsAppNumber('05551234567')).toBe('905551234567');
    });

    it('should return empty string for empty input', () => {
      expect(formatWhatsAppNumber('')).toBe('');
    });
  });

  describe('2. Slug Collision Resolution', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return base slug if no collision exists', async () => {
      (prisma.product.findFirst as any).mockResolvedValue(null);
      
      const slug = await createUniqueSlug('Mavi Kazak', 'biz-1');
      expect(slug).toBe('mavi-kazak');
    });

    it('should append -1 if base slug exists', async () => {
      // First call: returns existing product
      // Second call: returns null (no collision for -1)
      (prisma.product.findFirst as any)
        .mockResolvedValueOnce({ id: 'p1', slug: 'mavi-kazak' })
        .mockResolvedValueOnce(null);
      
      const slug = await createUniqueSlug('Mavi Kazak', 'biz-1');
      expect(slug).toBe('mavi-kazak-1');
    });

    it('should increment counter until unique slug is found', async () => {
      (prisma.product.findFirst as any)
        .mockResolvedValueOnce({ id: 'p1', slug: 'mavi-kazak' })
        .mockResolvedValueOnce({ id: 'p2', slug: 'mavi-kazak-1' })
        .mockResolvedValueOnce(null);
      
      const slug = await createUniqueSlug('Mavi Kazak', 'biz-1');
      expect(slug).toBe('mavi-kazak-2');
    });
  });

  describe('3. Express Payload Limit (10MB)', () => {
    it('should accept a payload larger than default 1MB (e.g., 2MB)', async () => {
      // Create a large string (approx 2MB)
      const largeData = 'a'.repeat(2 * 1024 * 1024);
      
      const res = await request(app)
        .post('/api/auth/login') // Using a public route to test limit
        .send({ data: largeData });
      
      // We expect 400/401 due to invalid credentials, but NOT 413 Payload Too Large
      expect(res.status).not.toBe(413);
    });
  });

  describe('4. Subdomain Extraction Logic', () => {
    it('should extract slug from subdomain', () => {
      expect(getSlugFromHostname('ahmet.dijitalvitrin.com')).toBe('ahmet');
      expect(getSlugFromHostname('butik.localhost:3000')).toBe('butik');
    });

    it('should return empty for base domains', () => {
      expect(getSlugFromHostname('dijitalvitrin.com')).toBe('');
      expect(getSlugFromHostname('localhost:3000')).toBe('');
    });

    it('should extract slug from path (for E2E/local tests)', () => {
      const { slug, remainingPath } = getSlugFromPathname('/ahmet/urunler');
      expect(slug).toBe('ahmet');
      expect(remainingPath).toBe('/urunler');
    });
  });

});

