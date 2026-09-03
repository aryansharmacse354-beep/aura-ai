import { useState, useEffect, useCallback } from 'react';

export type AppTheme = 'slate' | 'oled' | 'cyan';

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('aurapredict_theme') as AppTheme) || 'slate';
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: AppTheme = prev === 'slate' ? 'oled' : 'slate';
      localStorage.setItem('aurapredict_theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (theme === 'oled') {
      document.documentElement.classList.add('theme-oled');
    } else {
      document.documentElement.classList.remove('theme-oled');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme
  };
}
