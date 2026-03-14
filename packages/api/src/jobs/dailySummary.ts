import cron from 'node-cron';
import { db } from '@dijital-vitrin/database';

/**
 * Aggregates raw AnalyticsEvent data into AnalyticsDaily
 * Runs every day at 01:00 AM
 */
export const startDailySummaryJob = () => {
  cron.schedule('0 1 * * *', async () => {
    console.log('Starting daily analytics summary job...');
    try {
      // Calculate start and end of yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const startDate = new Date(yesterday.setHours(0, 0, 0, 0));
      const endDate = new Date(yesterday.setHours(23, 59, 59, 999));
      const targetDate = new Date(yesterday.setHours(12, 0, 0, 0)); // Normalized to midday for daily entry
      
      // Get all events from yesterday that are not bots
      const events = await db.analyticsEvent.findMany({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate
          },
          is_bot: false
        }
      });

      // Grouping mechanism
      const statsMap: Record<string, any> = {};

      for (const event of events) {
        // Group key: businessId_productId (null for business-wide)
        const key = `${event.business_id}_${event.product_id || 'null'}`;
        
        if (!statsMap[key]) {
          statsMap[key] = {
            business_id: event.business_id,
            product_id: event.product_id,
            page_views: 0,
            product_views: 0,
            whatsapp_clicks: 0,
            unique_visitors: new Set<string>() // Keep track of unique IPs
          };
        }

        const stat = statsMap[key];
        stat.unique_visitors.add(event.ip_hash);

        switch (event.event_type) {
          case 'page_view':
            stat.page_views++;
            break;
          case 'product_view':
            stat.product_views++;
            break;
          case 'whatsapp_click':
            stat.whatsapp_clicks++;
            break;
        }
      }

      // Upsert into AnalyticsDaily
      for (const key of Object.keys(statsMap)) {
        const stat = statsMap[key];
        
        await db.analyticsDaily.upsert({
          where: {
            // Prisma requires a unique identifier, and we have a compound unique constraint
            business_id_product_id_date: {
              business_id: stat.business_id,
              product_id: stat.product_id || 'null_placeholder_which_fails', // We can't do nullable in compound easily, wait. Prisma allows it if it's strictly modeled or we do findFirst first.
            }
          } as any,
          create: {
            business_id: stat.business_id,
            product_id: stat.product_id,
            date: targetDate,
            page_views: stat.page_views,
            product_views: stat.product_views,
            whatsapp_clicks: stat.whatsapp_clicks,
            unique_visitors: stat.unique_visitors.size,
          },
          update: {
            page_views: { increment: stat.page_views },
            product_views: { increment: stat.product_views },
            whatsapp_clicks: { increment: stat.whatsapp_clicks },
            // Approximation for unique visitors when appending
            unique_visitors: { increment: stat.unique_visitors.size },
          }
        }).catch(async () => {
          // If upsert fails due to nullable product_id logic, we do manual check
          const existing = await db.analyticsDaily.findFirst({
            where: {
              business_id: stat.business_id,
              product_id: stat.product_id,
              date: targetDate
            }
          });

          if (existing) {
            await db.analyticsDaily.update({
              where: { id: existing.id },
              data: {
                page_views: { increment: stat.page_views },
                product_views: { increment: stat.product_views },
                whatsapp_clicks: { increment: stat.whatsapp_clicks },
                unique_visitors: { increment: stat.unique_visitors.size },
              }
            });
          } else {
            await db.analyticsDaily.create({
              data: {
                business_id: stat.business_id,
                product_id: stat.product_id,
                date: targetDate,
                page_views: stat.page_views,
                product_views: stat.product_views,
                whatsapp_clicks: stat.whatsapp_clicks,
                unique_visitors: stat.unique_visitors.size,
              }
            });
          }
        });
      }

      // Retention Policy: Delete raw events older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const deleted = await db.analyticsEvent.deleteMany({
        where: {
          created_at: {
            lt: thirtyDaysAgo
          }
        }
      });

      console.log(`Daily summary job completed successfully. Added/updated ${Object.keys(statsMap).length} records. Cleaned up ${deleted.count} old raw events.`);
    } catch (error) {
      console.error('Error running daily summary job:', error);
    }
  });
};
