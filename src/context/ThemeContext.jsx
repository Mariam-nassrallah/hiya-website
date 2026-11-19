import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ThemeContext = createContext(null);
const KEY = 'hiyaTheme';

// index.html applies the saved theme before React loads, so start from that.
const initialTheme = () =>
  document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const timer = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable */
    }
    // Phone browsers colour the status bar / address bar with theme-color.
    // The navbar is olive in both themes, so this stays olive too.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#697A32');
  }, [theme]);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      document.documentElement.classList.remove('theme-switching');
    },
    [],
  );

  const toggle = useCallback(() => {
    // Briefly turn on colour transitions everywhere so the switch is smooth.
    const root = document.documentElement;
    root.classList.add('theme-switching');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => root.classList.remove('theme-switching'), 650);
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
