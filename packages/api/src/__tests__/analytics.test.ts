import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import app from '../app';
import { db } from '@dijital-vitrin/database';

describe('Analytics API', () => {
  let businessId: string;

  beforeAll(async () => {
    // Create a dummy business for tracking
    const business = await db.business.create({
      data: {
        name: 'Analytics Test Business',
        slug: 'analytics-test',
        sector: 'butik',
        whatsapp: '+905554443322',
        theme_primary: '#000000',
        theme_accent: '#ffffff',
        max_images_per_product: 7,
        product_sort_mode: 'random',
        is_active: true,
        auto_deactivate: false,
        subscription_plan: 'monthly',
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    businessId = business.id;
  });

  afterAll(async () => {
    // Clean up
    await db.business.deleteMany({
      where: { id: businessId }
    });
  });

  describe('POST /api/analytics/event', () => {
    it('should successfully track a page view', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          businessId,
          eventType: 'page_view'
        });

      expect(res.status).toBe(204);

      // Verify in DB
      const events = await db.analyticsEvent.findMany({
        where: { business_id: businessId, event_type: 'page_view' }
      });
      expect(events.length).toBeGreaterThan(0);
    });

    it('should mark event as bot if user-agent is a known bot', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .set('User-Agent', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
        .send({
          businessId,
          eventType: 'product_view'
        });

      expect(res.status).toBe(204);

      const events = await db.analyticsEvent.findMany({
        where: { business_id: businessId, event_type: 'product_view', is_bot: true }
      });
      expect(events.length).toBeGreaterThan(0);
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

    it('should missing required fields error', async () => {
      const res = await request(app)
        .post('/api/analytics/event')
        .send({
          eventType: 'page_view'
        });

      expect(res.status).toBe(400);
    });
  });
});
