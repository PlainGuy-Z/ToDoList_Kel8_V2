/**
 * useKeyboardShortcuts — custom hook for handling application-wide keyboard shortcuts.
 */
import { useEffect } from 'react';

export default function useKeyboardShortcuts({
  onNewTask,
  onTogglePomodoro,
  onToggleHelp,
  onEscape
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      const tag = document.activeElement.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        if (e.key === 'Escape' && onEscape) {
          onEscape();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          if (onNewTask) {
            e.preventDefault();
            onNewTask();
          }
          break;
        case 'p':
          if (onTogglePomodoro) {
            e.preventDefault();
            onTogglePomodoro();
          }
          break;
        case '?':
        case '/':
          if (onToggleHelp) {
            e.preventDefault();
            onToggleHelp();
          }
          break;
        case 'escape':
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onTogglePomodoro, onToggleHelp, onEscape]);
}
