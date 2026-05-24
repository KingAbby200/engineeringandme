import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const cookieMatch = document.cookie.match(/(?:^|; )theme=([^;]+)/);
      const saved = (cookieMatch && decodeURIComponent(cookieMatch[1])) || localStorage.getItem('theme') || 'light';
      set({ theme: saved });
      document.documentElement.setAttribute('data-theme', saved);
    }
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      try { document.cookie = `theme=${encodeURIComponent(newTheme)}; path=/; max-age=${60 * 60 * 24 * 365}`; } catch (e) {}
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    });
  },
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    try { document.cookie = `theme=${encodeURIComponent(theme)}; path=/; max-age=${60 * 60 * 24 * 365}`; } catch (e) {}
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
