import { useEffect } from 'react';

/**
 * FocusMode — fullscreen overlay that hides all distractions.
 */
export default function FocusMode({
  mode,
  timeLeft,
  isRunning,
  progress,
  selectedTask,
  pomodorosToday,
  start,
  pause,
  reset,
  onExit,
}) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onExit]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isFocus = mode === 'focus';
  const accentColor = isFocus ? '#7C9E87' : '#D4826A';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6
                    bg-zen-bg dark:bg-zen-bg-dark zen-fade-in overflow-hidden">

      {/* Exit button — top right (lebih kecil dan ringkas) */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 flex items-center gap-1
                   text-[11px] font-medium text-zen-muted dark:text-zen-muted-dark
                   hover:text-zen-text dark:hover:text-zen-text-dark
                   transition-colors px-2 py-1 rounded-md
                   hover:bg-zen-surface dark:hover:bg-zen-surface-dark"
        aria-label="Exit focus mode"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6"  y1="6" x2="18" y2="18"/>
        </svg>
        Exit
      </button>

      {/* ESC hint — bottom center (tidak bentrok dengan tombol Exit) */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-1.5 text-[10px] text-zen-muted dark:text-zen-muted-dark
                        bg-zen-surface/60 dark:bg-zen-surface-dark/60
                        px-2.5 py-1 rounded-full backdrop-blur-sm">
          <kbd className="px-1 py-0.5 text-[9px] font-mono font-semibold
                         bg-white/30 dark:bg-black/30 rounded
                         border border-zen-border dark:border-zen-border-dark">
            ESC
          </kbd>
          <span>exit</span>
        </div>
      </div>

      {/* Mode label */}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-xs font-semibold tracking-widest uppercase"
           style={{ color: accentColor }}>
          {isFocus ? 'FOCUS' : 'BREAK'}
        </p>
        
        {/* Progress text kecil di bawah mode */}
        <p className="text-[10px] text-zen-muted dark:text-zen-muted-dark">
          {Math.round(progress * 100)}%
        </p>
      </div>

      {/* Ring timer */}
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ display: 'block' }}>
          {/* Track */}
          <circle cx="100" cy="100" r={radius - 10}
            fill="none" stroke="#e5e7eb" strokeWidth="6" />
          {/* Progress */}
          <circle cx="100" cy="100" r={radius - 10}
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          {/* Time text */}
          <text x="100" y="96" textAnchor="middle" dominantBaseline="middle"
            fontSize="32" fontWeight="700" fontFamily="inherit"
            fill="currentColor" className="text-zen-text dark:text-zen-text-dark">
            {minutes}:{seconds}
          </text>
          <text x="100" y="122" textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="inherit" fill="#9ca3af">
            {pomodorosToday} sesi
          </text>
        </svg>
      </div>

      {/* Controls - hanya play/pause dan reset */}
      <div className="flex items-center gap-5">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full border border-zen-border dark:border-zen-border-dark
                     flex items-center justify-center
                     text-zen-muted dark:text-zen-muted-dark
                     hover:bg-zen-surface dark:hover:bg-zen-surface-dark 
                     hover:scale-105 transition-all duration-200"
          aria-label="Reset"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
          </svg>
        </button>

        <button
          onClick={isRunning ? pause : start}
          className="w-14 h-14 rounded-full flex items-center justify-center
                     text-white shadow-lg transition-all duration-200 
                     hover:scale-105 active:scale-95"
          style={{ backgroundColor: accentColor }}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>
      </div>

      {/* Selected task */}
      {selectedTask ? (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-zen-surface/80 dark:bg-zen-surface-dark/80
                        border border-zen-border dark:border-zen-border-dark">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-medium text-zen-text dark:text-zen-text-dark">
            {selectedTask.title}
          </span>
        </div>
      ) : (
        <p className="text-[11px] text-zen-muted dark:text-zen-muted-dark italic">
          no task
        </p>
      )}
    </div>
  );
}