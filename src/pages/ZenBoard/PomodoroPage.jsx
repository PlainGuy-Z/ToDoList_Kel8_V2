import { useState, useEffect } from 'react';
import usePomodoro from '../../hooks/usePomodoro';
import useTasks from '../../hooks/useTasks';
import PomodoroTimer from '../../components/PomodoroTimer';
import FocusMode from '../../components/FocusMode';

const TIPS = [
  "Put your phone face-down. 🌿",
  "Close unrelated tabs. 🧘‍♂️",
  "Take a deep breath before starting. 🍃",
  "Focus on one thing at a time. 🪷",
  "Hydrate during your break. 💧"
];

export default function PomodoroPage() {
  const pomodoro = usePomodoro();
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [currentTip, setCurrentTip] = useState(TIPS[0]);
  const [isFocusMode, setIsFocusMode] = useState(false);   // ← state focus mode

  // Cycle tips on mode change
  useEffect(() => {
    setCurrentTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, [pomodoro.mode, pomodoro.pomodorosToday]);

  const activeTasks = tasks.filter(t => !t.completed);
  const selectedTask = activeTasks.find(t => t.id === selectedTaskId);

  const cycleCount = pomodoro.pomodorosToday % 4;
  const dots = Array.from({ length: 4 }).map((_, i) => i < cycleCount);

  // Listen for keyboard shortcut toggle pomodoro
  useEffect(() => {
    const handler = () => {
      pomodoro.isRunning ? pomodoro.pause() : pomodoro.start();
    };
    window.addEventListener('zen:toggle-pomodoro', handler);
    return () => window.removeEventListener('zen:toggle-pomodoro', handler);
  }, [pomodoro]);

  return (
    <>
      {/* Focus Mode overlay */}
      {isFocusMode && (
        <FocusMode
          mode={pomodoro.mode}
          timeLeft={pomodoro.timeLeft}
          isRunning={pomodoro.isRunning}
          progress={pomodoro.progress}
          selectedTask={selectedTask}
          pomodorosToday={pomodoro.pomodorosToday}
          start={pomodoro.start}
          pause={pomodoro.pause}
          reset={pomodoro.reset}
          onExit={() => setIsFocusMode(false)}
        />
      )}

      <div className="max-w-[560px] mx-auto space-y-8 pb-12 zen-fade-in">

        {/* 1. Mode Selector */}
        <section className="flex bg-zen-surface dark:bg-zen-surface-dark rounded-xl p-1.5 border border-zen-border dark:border-zen-border-dark zen-slide-up" style={{ animationDelay: '0.05s' }}>
          <button className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${pomodoro.mode === 'focus' ? 'bg-zen-sage text-white shadow' : 'text-zen-muted dark:text-zen-muted-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark'}`}>
            🌿 Focus 25m
          </button>
          <button className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${pomodoro.mode === 'break' ? 'bg-zen-rose text-white shadow' : 'text-zen-muted dark:text-zen-muted-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark'}`}>
            ☕ Break 5m
          </button>
        </section>

        {/* 2. Main Timer */}
        <section className="zen-slide-up" style={{ animationDelay: '0.1s' }}>
          <PomodoroTimer
            mode={pomodoro.mode}
            timeLeft={pomodoro.timeLeft}
            isRunning={pomodoro.isRunning}
            progress={pomodoro.progress}
            pomodorosToday={pomodoro.pomodorosToday}
            start={pomodoro.start}
            pause={pomodoro.pause}
            reset={pomodoro.reset}
          />
        </section>

        {/* 3. Session Tracker */}
        <section className="text-center space-y-2 zen-slide-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-sm font-medium text-zen-text dark:text-zen-text-dark">
            Session {cycleCount === 0 && pomodoro.pomodorosToday > 0 ? 4 : cycleCount} of 4
          </p>
          <div className="flex justify-center gap-2">
            {dots.map((filled, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-colors ${filled ? 'bg-zen-sage' : 'bg-zen-border dark:bg-zen-border-dark'}`} />
            ))}
          </div>
        </section>

        {/* 4. Task Linker */}
        <section className="zen-card p-5 zen-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-medium text-zen-muted dark:text-zen-muted-dark mb-2">
            Currently working on:
          </label>
          <select
            className="zen-input w-full cursor-pointer"
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
          >
            <option value="">-- Select a task to focus on --</option>
            {activeTasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          {selectedTask && (
            <div className="mt-3 p-3 bg-zen-bg dark:bg-zen-bg-dark rounded-xl border border-zen-border dark:border-zen-border-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-zen-sage flex-shrink-0"></span>
              <span className="text-sm font-medium text-zen-text dark:text-zen-text-dark truncate">
                {selectedTask.title}
              </span>
            </div>
          )}
        </section>

        {/* 5. Enter Focus Mode button */}
        <section className="zen-slide-up" style={{ animationDelay: '0.22s' }}>
          <button
            onClick={() => setIsFocusMode(true)}
            className="w-full flex items-center justify-center gap-2
                       py-3 rounded-2xl font-medium text-sm
                       bg-zen-sage text-white
                       hover:opacity-90 active:scale-[0.98]
                       transition-all duration-200 shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            </svg>
            Masuk Focus Mode
          </button>
        </section>

        {/* 6. Tips Card */}
        <section className="bg-zen-sage-soft dark:bg-zen-sage/10 border border-zen-sage/30 rounded-2xl p-4 text-center zen-slide-up" style={{ animationDelay: '0.25s' }}>
          <p className="text-sm font-medium text-zen-sage">
            {currentTip}
          </p>
        </section>

      </div>
    </>
  );
}