import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, token: null, refreshToken: null, loading: true,
      checkAuth: async () => {
        if (!get().token) { set({ loading: false }); return; }
        try { const { data } = await authAPI.me(); set({ user: data.data, loading: false }); }
        catch { set({ user: null, token: null, refreshToken: null, loading: false }); }
      },
      login: async (c) => { const { data } = await authAPI.login(c); set({ user: data.data, token: data.token, refreshToken: data.refreshToken }); return data; },
      register: async (d) => { const { data } = await authAPI.register(d); return data.data; },
      verifyOtp: async (d) => { const { data } = await authAPI.verifyOtp(d); set({ user: data.data, token: data.token, refreshToken: data.refreshToken }); return data; },
      resendOtp: async (e) => { await authAPI.resendOtp(e); },
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
      updateUser: (d) => set((s) => ({ user: { ...s.user, ...d } })),
    }),
    { name: 'platty-auth', partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken }) }
  )
);
