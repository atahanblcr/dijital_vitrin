import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: string;
  business_id: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('ba_access_token'),
  accessToken: localStorage.getItem('ba_access_token'),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('ba_access_token', accessToken);
    localStorage.setItem('ba_refresh_token', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ba_access_token');
    localStorage.removeItem('ba_refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
