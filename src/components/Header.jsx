import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Zen Board header — app title, greeting, dark mode toggle, and logout.
 */
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format today's date
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="flex items-center justify-between py-6 px-6 sm:px-8 zen-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-zen-text dark:text-zen-text-dark tracking-tight flex items-center gap-2">
          <span>🪷</span>
          <span>Zen Board</span>
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark text-sm mt-1 font-sans">
          {today}
          {currentUser && (
            <span className="ml-2">
              — Halo, <span className="font-medium text-zen-sage">{currentUser.username}</span>
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-zen-surface dark:bg-zen-surface-dark border border-zen-border dark:border-zen-border-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark cursor-pointer"
          title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          id="theme-toggle"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zen-text dark:text-zen-text-dark">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zen-text dark:text-zen-text-dark">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-zen-surface dark:bg-zen-surface-dark border border-zen-border dark:border-zen-border-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark cursor-pointer"
          title="Keluar"
          id="logout-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zen-text dark:text-zen-text-dark">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
