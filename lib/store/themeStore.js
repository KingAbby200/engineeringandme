import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') || 'light';
      set({ theme: saved });
      document.documentElement.setAttribute('data-theme', saved);
    }
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    });
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
