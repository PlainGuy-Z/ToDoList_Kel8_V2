import { useState, useEffect, useCallback, useRef } from 'react';

const POMODOROS_KEY = 'zenboard-pomodoros';

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60;  // 5 minutes in seconds

/**
 * Get today's date string (YYYY-MM-DD) for tracking daily pomodoros.
 */
const getTodayKey = () => new Date().toISOString().slice(0, 10);

/**
 * Load pomodoro count history from localStorage.
 */
const loadPomodoros = () => {
  try {
    const raw = localStorage.getItem(POMODOROS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Play a soft chime using the Web Audio API (no external files needed).
 */
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 1.5);
    });
  } catch {
    // Web Audio API not supported — silent fallback
  }
};

/**
 * Pomodoro timer hook.
 * Manages focus/break cycles with auto-switching and session tracking.
 */
export default function usePomodoro() {
  const [mode, setMode] = useState('focus');         // 'focus' | 'break'
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosToday, setPomodorosToday] = useState(0);
  const intervalRef = useRef(null);

  // Load today's pomodoro count on mount
  useEffect(() => {
    const history = loadPomodoros();
    const today = getTodayKey();
    setPomodorosToday(history[today] || 0);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Session completed!
          clearInterval(intervalRef.current);
          playChime();

          if (mode === 'focus') {
            // Increment today's pomodoro count
            const history = loadPomodoros();
            const today = getTodayKey();
            history[today] = (history[today] || 0) + 1;
            localStorage.setItem(POMODOROS_KEY, JSON.stringify(history));
            setPomodorosToday(history[today]);

            // Switch to break
            setMode('break');
            setTimeLeft(BREAK_DURATION);
            setIsRunning(true);
          } else {
            // Break finished — switch back to focus (paused)
            setMode('focus');
            setTimeLeft(FOCUS_DURATION);
            setIsRunning(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(FOCUS_DURATION);
  }, []);

  /** Total duration for current mode (used for progress calculation) */
  const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;

  /** Progress percentage (0 to 1) — how much time has elapsed */
  const progress = 1 - (timeLeft / totalDuration);

  return {
    mode,
    timeLeft,
    isRunning,
    pomodorosToday,
    progress,
    totalDuration,
    start,
    pause,
    reset
  };
}
