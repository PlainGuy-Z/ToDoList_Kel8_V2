import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useStats from '../../hooks/useStats';
import useTasks from '../../hooks/useTasks';
import usePomodoro from '../../hooks/usePomodoro';

const NAV_LINKS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/app/tasks', label: 'Tasks', icon: '✅' },
  { path: '/app/pomodoro', label: 'Pomodoro', icon: '🍅' },
  { path: '/app/stats', label: 'Statistics', icon: '📊' }
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // We need basic stats for the streak badge
  const { tasks } = useTasks();
  const { pomodorosToday } = usePomodoro();
  const { streak } = useStats(tasks, pomodorosToday);

  const activeCount = tasks.filter(t => !t.completed).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-[64px] lg:w-[240px] h-full bg-[#F0ECE6] dark:bg-[#111111] border-r border-zen-border dark:border-zen-border-dark transition-all duration-300 z-40">
        {/* Top: Logo */}
        <div className="h-20 flex items-center px-4 lg:px-6 border-b border-zen-border dark:border-zen-border-dark">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl flex-shrink-0">🌿</span>
            <div className="hidden lg:block whitespace-nowrap">
              <h1 className="text-lg font-bold text-zen-text dark:text-zen-text-dark tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Zen Board
              </h1>
              <p className="text-xs text-zen-muted dark:text-zen-muted-dark font-medium mt-0.5">
                stay focused, stay calm
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto zen-scroll">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                group relative overflow-hidden
                ${isActive 
                  ? 'bg-zen-surface hover:bg-zen-surface-hover dark:bg-zen-surface-dark dark:hover:bg-zen-surface-hover-dark text-zen-sage border-l-4 border-l-zen-sage shadow-sm' 
                  : 'text-zen-text dark:text-zen-text-dark hover:bg-[#E8E4DF] dark:hover:bg-[#1E1E1E] border-l-4 border-l-transparent'
                }
              `}
              title={link.label}
            >
              <span className="text-xl flex-shrink-0 w-6 text-center">{link.icon}</span>
              <span className="hidden lg:block font-medium whitespace-nowrap">{link.label}</span>
              
              {/* Task Counter Badge */}
              {link.path === '/app/tasks' && activeCount > 0 && (
                <span className="
                  ml-auto hidden lg:flex items-center justify-center
                  min-w-[20px] h-5 px-1.5
                  bg-zen-sage text-white
                  text-[10px] font-bold rounded-full
                ">
                  {activeCount > 99 ? '99+' : activeCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zen-border dark:border-zen-border-dark flex flex-col gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-zen-border dark:border-zen-border-dark" title={`${streak} day streak`}>
            <span className="text-lg flex-shrink-0">🔥</span>
            <span className="hidden lg:block text-sm font-medium text-zen-text dark:text-zen-text-dark whitespace-nowrap">
              {streak} day streak
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-2 mt-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-zen-muted dark:text-zen-muted-dark hover:text-zen-text dark:hover:text-zen-text-dark hover:bg-[#E8E4DF] dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer w-full"
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              <span className="flex-shrink-0">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span className="hidden lg:block text-sm font-medium whitespace-nowrap">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </button>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl text-zen-priority-high hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer w-full"
              title={`Logout (${currentUser?.username})`}
            >
              <span className="flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span className="hidden lg:block text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zen-surface dark:bg-zen-surface-dark border-t border-zen-border dark:border-zen-border-dark flex justify-around items-center h-16 z-50 px-2 pb-safe">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
              ${isActive ? 'text-zen-sage' : 'text-zen-muted dark:text-zen-muted-dark hover:text-zen-text dark:hover:text-zen-text-dark'}
            `}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
