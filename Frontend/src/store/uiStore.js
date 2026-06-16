import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'light', sidebarOpen: false, profileTab: 'info',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setSidebarOpen: (o) => set({ sidebarOpen: o }),
      setProfileTab: (t) => set({ profileTab: t }),
    }),
    { name: 'platty-ui', partialize: (s) => ({ theme: s.theme }) }
  )
);
