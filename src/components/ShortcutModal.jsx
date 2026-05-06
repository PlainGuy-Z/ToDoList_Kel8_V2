/**
 * ShortcutModal — Displays available keyboard shortcuts.
 */
export default function ShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Focus ke input task baru' },
    { key: 'P', desc: 'Start / Pause Pomodoro' },
    { key: '? / /', desc: 'Buka/tutup daftar shortcut ini' },
    { key: 'Esc', desc: 'Tutup modal / keluar focus mode' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm zen-fade-in"
      onClick={onClose}
    >
      <div 
        className="zen-card w-full max-w-md overflow-hidden zen-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-zen-border dark:border-zen-border-dark">
          <h2 className="text-lg font-bold text-zen-text dark:text-zen-text-dark flex items-center gap-2">
            <span>⌨️</span> Keyboard Shortcuts
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zen-surface dark:hover:bg-zen-surface-dark rounded-full transition-colors text-zen-muted dark:text-zen-muted-dark"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <table className="w-full text-left">
            <tbody className="divide-y divide-zen-border dark:divide-zen-border-dark">
              {shortcuts.map((s, i) => (
                <tr key={i}>
                  <td className="py-3 pr-4">
                    <kbd className="px-2 py-1 bg-zen-surface dark:bg-zen-surface-dark border border-zen-border dark:border-zen-border-dark rounded-md font-mono text-xs text-zen-text dark:text-zen-text-dark shadow-sm">
                      {s.key}
                    </kbd>
                  </td>
                  <td className="py-3 text-sm text-zen-muted dark:text-zen-muted-dark">
                    {s.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-zen-surface dark:bg-zen-surface-dark border-t border-zen-border dark:border-zen-border-dark text-center">
          <p className="text-[11px] text-zen-muted dark:text-zen-muted-dark italic">
            Klik di mana saja untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
}
