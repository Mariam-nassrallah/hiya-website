import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from './Icons';

/** Round sun/moon button that switches between the light and dark theme. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="nav-icon theme-toggle"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <span className={`tt-icon${dark ? '' : ' on'}`}><SunIcon /></span>
      <span className={`tt-icon${dark ? ' on' : ''}`}><MoonIcon /></span>
    </button>
  );
}
