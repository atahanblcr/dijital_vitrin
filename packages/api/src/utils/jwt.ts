import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  username: string;
  role: 'super_admin' | 'business_admin';
  business_id?: string | null;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '8h', // SKILL dokümanındaki zorunluluk: 8 saat
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign({ id: payload.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // SKILL dokümanındaki zorunluluk: 7 gün
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
}
