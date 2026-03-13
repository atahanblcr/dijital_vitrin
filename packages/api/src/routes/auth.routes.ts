import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { authenticate, requireSuperAdmin } from '../middleware/auth';
import {
  loginSchema,
  verify2FaSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Herkese açık endpointler
router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);
router.post('/verify-2fa', loginRateLimiter, validate(verify2FaSchema), authController.verify2FA);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

// Sadece Süper Admin
router.post(
  '/reset-password',
  authenticate,
  requireSuperAdmin,
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
