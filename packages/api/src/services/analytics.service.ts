import { db } from '@dijital-vitrin/database';
import { EventType } from '@prisma/client';
import crypto from 'crypto';
import { isBot } from '@dijital-vitrin/shared/constants/botPatterns';

export class AnalyticsService {
  /**
   * Generates a secure hash for an IP address.
   */
  private static hashIp(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Tracks an event in the system.
   */
  public static async trackEvent(data: {
    businessId: string;
    eventType: EventType;
    ipAddress: string;
    userAgent?: string;
    productId?: string;
    blogPostId?: string;
  }) {
    const isBotRequest = isBot(data.userAgent);
    
    // Hash IP for privacy (KVKK compliance)
    const ipHash = this.hashIp(data.ipAddress);
    
    // Check if it's a spam request (same IP hash and same event within 1 minute)
    // To keep it fast, we do this only for page views and product views
    if (!isBotRequest && (data.eventType === 'page_view' || data.eventType === 'product_view' || data.eventType === 'blog_view')) {
      const oneMinuteAgo = new Date(Date.now() - 60000);
      
      const recentEvent = await db.analyticsEvent.findFirst({
        where: {
          business_id: data.businessId,
          ip_hash: ipHash,
          event_type: data.eventType,
          product_id: data.productId,
          blog_post_id: data.blogPostId,
          created_at: {
            gte: oneMinuteAgo
          }
        }
      });
      
      if (recentEvent) {
        // Skip logging if it's a rapid repeated request from the same IP
        return null;
      }
    }

    const isMobile = data.userAgent ? /mobile/i.test(data.userAgent) : false;

    return await db.analyticsEvent.create({
      data: {
        business_id: data.businessId,
        event_type: data.eventType,
        ip_hash: ipHash,
        is_mobile: isMobile,
        is_bot: isBotRequest,
        product_id: data.productId,
        blog_post_id: data.blogPostId,
      }
    });
  }

  /**
   * Get basic stats for a specific business (used in Business Admin Panel)
   */
  public static async getBusinessStats(businessId: string, startDate: Date, endDate: Date) {
    const dailyStats = await db.analyticsDaily.findMany({
      where: {
        business_id: businessId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        product_id: null, // Get overall business stats
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate totals
    const totals = dailyStats.reduce((acc, curr) => {
      acc.pageViews += curr.page_views;
      acc.uniqueVisitors += curr.unique_visitors;
      acc.productViews += curr.product_views;
      acc.whatsappClicks += curr.whatsapp_clicks;
      return acc;
    }, { pageViews: 0, uniqueVisitors: 0, productViews: 0, whatsappClicks: 0 });

    return {
      totals,
      daily: dailyStats
    };
  }

  /**
   * Get platform wide stats (used in Super Admin Panel)
   */
  public static async getPlatformStats(startDate: Date, endDate: Date) {
    const dailyStats = await db.analyticsDaily.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        product_id: null,
      }
    });

    const totals = dailyStats.reduce((acc, curr) => {
      acc.pageViews += curr.page_views;
      acc.uniqueVisitors += curr.unique_visitors;
      acc.whatsappClicks += curr.whatsapp_clicks;
      return acc;
    }, { pageViews: 0, uniqueVisitors: 0, whatsappClicks: 0 });

    // Group by business
    const byBusiness: Record<string, { pageViews: number; whatsappClicks: number }> = {};
    dailyStats.forEach(stat => {
      if (!byBusiness[stat.business_id]) {
        byBusiness[stat.business_id] = { pageViews: 0, whatsappClicks: 0 };
      }
      byBusiness[stat.business_id].pageViews += stat.page_views;
      byBusiness[stat.business_id].whatsappClicks += stat.whatsapp_clicks;
    });

    return {
      totals,
      byBusiness
    };
  }
}
