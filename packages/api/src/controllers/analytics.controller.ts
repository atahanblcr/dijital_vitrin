import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { EventType } from '@prisma/client';

export class AnalyticsController {
  /**
   * Endpoint for tracking events from storefront (Public)
   * POST /api/analytics/event
   */
  public static async trackEvent(req: Request, res: Response) {
    try {
      const { businessId, eventType, productId, blogPostId } = req.body;

      if (!businessId || !eventType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validating eventType
      const validEvents: EventType[] = ['page_view', 'product_view', 'whatsapp_click', 'blog_view'];
      if (!validEvents.includes(eventType as EventType)) {
        return res.status(400).json({ error: 'Invalid event type' });
      }

      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
      const userAgent = req.headers['user-agent'];

      await AnalyticsService.trackEvent({
        businessId,
        eventType: eventType as EventType,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress.split(',')[0],
        userAgent,
        productId,
        blogPostId
      });

      // We respond immediately with 204 (No Content) to not block the frontend
      return res.status(204).send();
    } catch (error) {
      console.error('Track event error:', error);
      return res.status(500).json({ error: 'Failed to track event' });
    }
  }

  /**
   * Get analytics for a specific business (Business Admin)
   * GET /api/business/analytics
   */
  public static async getBusinessAnalytics(req: Request, res: Response) {
    try {
      const businessId = req.user?.business_id;
      if (!businessId) {
        return res.status(403).json({ error: 'Business ID is missing from user session' });
      }

      const days = parseInt((req.query.days as string) || '30', 10);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const stats = await AnalyticsService.getBusinessStats(businessId, startDate, endDate);
      
      return res.json(stats);
    } catch (error) {
      console.error('Get business analytics error:', error);
      return res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  }

  /**
   * Get platform-wide analytics (Super Admin)
   * GET /api/admin/analytics
   */
  public static async getPlatformAnalytics(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const days = parseInt((req.query.days as string) || '30', 10);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const stats = await AnalyticsService.getPlatformStats(startDate, endDate);
      
      return res.json(stats);
    } catch (error) {
      console.error('Get platform analytics error:', error);
      return res.status(500).json({ error: 'Failed to retrieve platform analytics' });
    }
  }
}
