import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY = 'zenboard-streak';
const POMODOROS_KEY = 'zenboard-pomodoros';

/**
 * Get today's date string (YYYY-MM-DD).
 */
const getTodayKey = () => new Date().toISOString().slice(0, 10);

/**
 * Get yesterday's date string (YYYY-MM-DD).
 */
const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

/**
 * Daily stats hook.
 * Computes completed/remaining tasks, pomodoro count, and day streak.
 */
export default function useStats(tasks, pomodorosToday) {
  const [streak, setStreak] = useState(0);

  /** Tasks completed today */
  const completedToday = tasks.filter(t => {
    if (!t.completed) return false;
    // Check if createdAt is today (tasks completed = marked done)
    // We consider all currently completed tasks whose createdAt matches today
    const taskDate = t.createdAt?.slice(0, 10);
    return taskDate === getTodayKey();
  }).length;

  /** Remaining (incomplete) tasks */
  const remaining = tasks.filter(t => !t.completed).length;

  /** Update streak logic on mount and whenever tasks change */
  useEffect(() => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    let streakData;
    try {
      streakData = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    } catch {
      streakData = {};
    }

    const { lastActiveDate, streak: savedStreak } = streakData;

    // Determine if we have activity today
    const hasActivityToday = completedToday > 0 || pomodorosToday > 0;

    let newStreak;

    if (lastActiveDate === today) {
      // Already recorded today — keep current streak
      newStreak = savedStreak || 1;
    } else if (lastActiveDate === yesterday && hasActivityToday) {
      // Continuing from yesterday — increment streak
      newStreak = (savedStreak || 0) + 1;
    } else if (hasActivityToday) {
      // Gap of more than 1 day, or first ever — start fresh
      newStreak = 1;
    } else {
      // No activity today yet
      if (lastActiveDate === yesterday) {
        // Show yesterday's streak (still valid, not broken yet)
        newStreak = savedStreak || 0;
      } else {
        newStreak = 0;
      }
    }

    // Save if we have activity today
    if (hasActivityToday && lastActiveDate !== today) {
      const updated = { lastActiveDate: today, streak: newStreak };
      localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    }

    setStreak(newStreak);
  }, [completedToday, pomodorosToday]);

  return {
    completedToday,
    remaining,
    pomodorosToday,
    streak
  };
}
