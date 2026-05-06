import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import ShortcutModal from '../ShortcutModal';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';

/**
 * AppLayout — wrapper for the sidebar and main scrollable content area.
 */
export default function AppLayout() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  useKeyboardShortcuts({
    onToggleHelp: () => setShowShortcuts(prev => !prev),
    onEscape: () => setShowShortcuts(false),
    onNewTask: () => {
      navigate('/app/tasks');
      setTimeout(() => {
        document.getElementById('task-title-input')?.focus();
      }, 100);
    },
    onTogglePomodoro: () => {
      window.dispatchEvent(new CustomEvent('zen:toggle-pomodoro'));
    }
  });

  return (
    <div className="flex h-screen bg-zen-bg dark:bg-zen-bg-dark overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-1 h-full overflow-y-auto pb-20 md:pb-0 relative">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Shortcuts Modal */}
      <ShortcutModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </div>
  );
}
