import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, requireBusinessAdmin, requireSuperAdmin } from '../middleware/auth';

const router = Router();

// Public route for tracking events from storefront
router.post('/event', AnalyticsController.trackEvent);

// Protected route for business admin
router.get('/business', authenticate, requireBusinessAdmin, AnalyticsController.getBusinessAnalytics);

// Protected route for super admin
router.get('/admin', authenticate, requireSuperAdmin, AnalyticsController.getPlatformAnalytics);

export default router;
