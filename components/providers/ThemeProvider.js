'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/themeStore';
import { useLanguageStore } from '@/lib/store/languageStore';

export default function ThemeProvider({ children }) {
  const initTheme = useThemeStore(state => state.initTheme);
  const initLanguage = useLanguageStore(state => state.initLanguage);

  useEffect(() => {
    initTheme();
    initLanguage();
  }, [initTheme, initLanguage]);

  return <>{children}</>;
}
