import { useCallback, useEffect, useMemo, useState } from 'react';

const REMINDER_HOURS = {
  morning: 8,
  evening: 17,
};

const getDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getReminderKey = (userId, slot, dateKey) => `zenboard-reminder-${userId}-${slot}-${dateKey}`;

const hasNotified = (userId, slot, dateKey) => {
  if (!userId) return false;
  return localStorage.getItem(getReminderKey(userId, slot, dateKey)) === '1';
};

const markNotified = (userId, slot, dateKey) => {
  if (!userId) return;
  localStorage.setItem(getReminderKey(userId, slot, dateKey), '1');
};

const getReminderSummary = (tasks) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const activeWithDate = tasks.filter((task) => !task.completed && task.dueDate);
  let dueToday = 0;
  let overdue = 0;

  activeWithDate.forEach((task) => {
    const due = new Date(task.dueDate);
    if (Number.isNaN(due.getTime())) return;
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    if (dueStart < todayStart) overdue += 1;
    else if (dueStart === todayStart) dueToday += 1;
  });

  return { dueToday, overdue, total: dueToday + overdue };
};

export default function useTaskReminders({ tasks, userId }) {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );

  const summary = useMemo(() => getReminderSummary(tasks), [tasks]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const sendReminder = useCallback((slot, dateKey) => {
    if (permission !== 'granted') return;
    if (summary.total === 0) return;
    if (hasNotified(userId, slot, dateKey)) return;

    const parts = [];
    if (summary.overdue > 0) parts.push(`${summary.overdue} overdue`);
    if (summary.dueToday > 0) parts.push(`${summary.dueToday} due hari ini`);

    const body = `Kamu punya ${parts.join(' dan ')}. Cek menu Hari Ini untuk menindaklanjuti.`;

    new Notification('Pengingat Zen Board', {
      body,
      tag: `zenboard-${slot}-${dateKey}`,
    });

    markNotified(userId, slot, dateKey);
  }, [permission, summary, userId]);

  useEffect(() => {
    if (permission !== 'granted' || !userId) return undefined;

    const checkAndNotify = () => {
      const now = new Date();
      const dateKey = getDateKey(now);

      if (now.getHours() >= REMINDER_HOURS.morning) {
        sendReminder('morning', dateKey);
      }

      if (now.getHours() >= REMINDER_HOURS.evening) {
        sendReminder('evening', dateKey);
      }
    };

    checkAndNotify();
    const intervalId = window.setInterval(checkAndNotify, 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, [permission, sendReminder, userId]);

  return {
    notificationPermission: permission,
    requestNotificationPermission: requestPermission,
  };
}
