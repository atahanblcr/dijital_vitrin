import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: string;
  business_id: string;
}

interface AuthState {
  user: User | null;
  business: any | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setBusiness: (business: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  business: null,
  isAuthenticated: !!localStorage.getItem('ba_access_token'),
  accessToken: localStorage.getItem('ba_access_token'),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('ba_access_token', accessToken);
    localStorage.setItem('ba_refresh_token', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem('ba_access_token', accessToken);
    // Token'dan user verisini çözmek için bir kütüphane veya basit parse gerekebilir.
    // Şimdilik sadece token ile yetkiyi veriyoruz, user null kalabilir (veya API'den /me ile çekilebilir).
    set({ accessToken, isAuthenticated: true });
  },

  setBusiness: (business) => {
    set({ business });
  },

  logout: () => {
    localStorage.removeItem('ba_access_token');
    localStorage.removeItem('ba_refresh_token');
    set({ user: null, business: null, accessToken: null, isAuthenticated: false });
  },
}));
