import { prisma } from '../config/database';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { authenticator } from 'otplib';

export const loginUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new AppError(401, 'Geçersiz kullanıcı adı veya şifre');
  }

  // Hesap kilit kontrolü
  if (user.locked_until && user.locked_until > new Date()) {
    const minutesLeft = Math.ceil((user.locked_until.getTime() - Date.now()) / 60000);
    throw new AppError(403, `Hesabınız ${minutesLeft} dakika kilitli. Lütfen bekleyin.`);
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    const failedAttempts = user.failed_attempts + 1;
    
    // 5 başarısız denemede hesabı kilitle (15 dk)
    if (failedAttempts >= 5) {
      const lockedUntil = new Date(Date.now() + 15 * 60000);
      await prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: failedAttempts, locked_until: lockedUntil },
      });
      throw new AppError(403, 'Çok fazla hatalı deneme. Hesabınız 15 dakika kilitlendi.');
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { failed_attempts: failedAttempts },
      });
      throw new AppError(401, 'Geçersiz kullanıcı adı veya şifre');
    }
  }

  // Başarılı girişte sayaçları sıfırla
  await prisma.user.update({
    where: { id: user.id },
    data: { failed_attempts: 0, locked_until: null, last_login: new Date() },
  });

  // 2FA Kontrolü
  if (user.totp_enabled) {
    return {
      requires2FA: true,
      userId: user.id,
      message: '2FA doğrulaması gerekiyor',
    };
  }

  // Token'ları oluştur
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    business_id: user.business_id,
  };

  return {
    requires2FA: false,
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: payload,
  };
};

export const verify2FA = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.totp_enabled || !user.totp_secret) {
    throw new AppError(400, '2FA aktif değil veya kullanıcı bulunamadı');
  }

  const isValid = authenticator.verify({ token, secret: user.totp_secret });

  if (!isValid) {
    throw new AppError(401, 'Geçersiz 2FA kodu');
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    business_id: user.business_id,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: payload,
  };
};

export const resetPassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password_hash: hashedPassword, failed_attempts: 0, locked_until: null },
  });
};
