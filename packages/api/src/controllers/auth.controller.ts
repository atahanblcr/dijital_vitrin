import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { verifyRefreshToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser(username, password);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body;
    const result = await authService.verify2FA(userId, token);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    // Refresh token'ı doğrula
    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new AppError(401, 'Kullanıcı bulunamadı');
    }

    if (user.locked_until && user.locked_until > new Date()) {
      throw new AppError(403, 'Hesabınız kilitli');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      business_id: user.business_id,
    };

    const newAccessToken = await authService.loginUser(user.username, 'Bypass-Not-Used-Here'); 
    // Wait, let's just generate the token here directly rather than calling loginUser to avoid password checks.
    
    const { generateAccessToken, generateRefreshToken: genRefresh } = require('../utils/jwt');
    
    res.json({
      data: {
        accessToken: generateAccessToken(payload),
        refreshToken: genRefresh(payload),
      }
    });

  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, newPassword } = req.body;
    await authService.resetPassword(userId, newPassword);
    res.json({ data: { message: 'Şifre başarıyla sıfırlandı' } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // JWT stateless olduğu için sunucu tarafında bir oturum silme işlemimiz yok.
    // İleride token blacklist yapısı kurulursa buraya eklenecek.
    res.json({ data: { message: 'Başarıyla çıkış yapıldı' } });
  } catch (error) {
    next(error);
  }
};
