'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      async fetchUser() {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user });
          } else {
            set({ user: null });
          }
        } catch {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },

      async logout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null });
      },
    }),
    { name: 'et-auth', partialize: (state) => ({ user: state.user }) }
  )
);
