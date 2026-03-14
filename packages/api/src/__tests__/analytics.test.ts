import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import app from '../app';
import { db } from '@dijital-vitrin/database';

// Mocking the database
vi.mock('@dijital-vitrin/database', () => {
  const mockPrisma = {
    business: {
      create: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    analyticsDaily: {
      findMany: vi.fn(),
    }
  };
  
  return {
    db: mockPrisma,
    prisma: mockPrisma,
    PrismaClient: class {
      constructor() {
        return mockPrisma;
      }
    },
    EventType: {
      page_view: 'page_view',
      product_view: 'product_view',
      whatsapp_click: 'whatsapp_click',
      blog_view: 'blog_view'
    }
  };
});

describe('Analytics API', () => {
  const businessId = 'test-business-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/analytics/event', () => {
    it('should successfully track a page view', async () => {
      (db.analyticsEvent.findFirst as any).mockResolvedValue(null);
      (db.analyticsEvent.create as any).mockResolvedValue({ id: 'event-1' });

      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          businessId,
          eventType: 'page_view'
        });

      expect(res.status).toBe(204);
      expect(db.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          business_id: businessId,
          event_type: 'page_view'
        })
      }));
    });

    it('should mark event as bot if user-agent is a known bot', async () => {
      (db.analyticsEvent.findFirst as any).mockResolvedValue(null);
      (db.analyticsEvent.create as any).mockResolvedValue({ id: 'event-2' });

      const res = await request(app)
        .post('/api/analytics/event')
        .set('User-Agent', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
        .send({
          businessId,
          eventType: 'product_view'
        });

      expect(res.status).toBe(204);
      expect(db.analyticsEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          is_bot: true
        })
      }));
    });

    it('should return 400 for invalid event types', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          businessId,
          eventType: 'invalid_event_type'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid event type');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          eventType: 'page_view'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing required fields');
    });
  });
});
