/**
 * Pomodoro Timer — circular SVG progress, focus/break modes, auto-switch.
 */
export default function PomodoroTimer({
  mode,
  timeLeft,
  isRunning,
  progress,
  pomodorosToday,
  start,
  pause,
  reset
}) {
  // Format seconds as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular progress config
  const size = 200;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const modeLabel = mode === 'focus' ? 'Fokus' : 'Istirahat';
  const modeColor = mode === 'focus' ? 'var(--color-zen-sage)' : 'var(--color-zen-rose)';

  return (
    <div className="zen-card p-6 sm:p-8 text-center zen-slide-up" style={{ animationDelay: '0.15s' }} id="pomodoro-panel">
      <h2 className="text-lg font-semibold text-zen-text dark:text-zen-text-dark mb-1">
        Pomodoro Timer
      </h2>
      <p className="text-zen-muted dark:text-zen-muted-dark text-sm mb-6">
        {modeLabel} — {mode === 'focus' ? '25 menit' : '5 menit'}
      </p>

      {/* Circular progress */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zen-border dark:text-zen-border-dark"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={modeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-light tracking-wider text-zen-text dark:text-zen-text-dark font-sans tabular-nums"
            style={{
              animation: isRunning ? 'zen-pulse-soft 3s ease-in-out infinite' : 'none'
            }}
          >
            {display}
          </span>
          <span
            className="text-xs font-medium mt-1 uppercase tracking-widest"
            style={{ color: modeColor }}
          >
            {modeLabel}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-5">
        {!isRunning ? (
          <button
            onClick={start}
            className="zen-btn-primary px-8 py-2.5 flex items-center gap-2"
            id="pomodoro-start"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Mulai
          </button>
        ) : (
          <button
            onClick={pause}
            className="zen-btn-secondary px-8 py-2.5 flex items-center gap-2"
            id="pomodoro-pause"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
            Jeda
          </button>
        )}
        <button
          onClick={reset}
          className="zen-btn-secondary px-5 py-2.5"
          id="pomodoro-reset"
          title="Reset timer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      {/* Pomodoro count */}
      <div className="flex items-center justify-center gap-2 text-sm text-zen-muted dark:text-zen-muted-dark">
        <span>🍅</span>
        <span>{pomodorosToday} sesi hari ini</span>
      </div>
    </div>
  );
}
