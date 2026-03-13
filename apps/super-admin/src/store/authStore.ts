import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: string;
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
  isAuthenticated: !!localStorage.getItem('sa_access_token'),
  accessToken: localStorage.getItem('sa_access_token'),

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('sa_access_token', accessToken);
    localStorage.setItem('sa_refresh_token', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('sa_access_token');
    localStorage.removeItem('sa_refresh_token');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
