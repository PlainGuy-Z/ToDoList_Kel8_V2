import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * useTasks — multi-user task management hook.
 * Data task disimpan per-user menggunakan key: 'zenboard-tasks-{userId}'
 * sehingga setiap akun memiliki data task yang terisolasi.
 */

/** Buat localStorage key unik untuk setiap user */
const getTasksKey = (userId) => `zenboard-tasks-${userId}`;

const RECURRENCE_TYPES = new Set(['none', 'daily', 'weekly', 'monthly']);

const normalizeRecurring = (value) => (RECURRENCE_TYPES.has(value) ? value : 'none');
const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return [...new Set(
    tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean)
  )];
};

const getNextDueDate = (dueDate, recurring) => {
  const base = dueDate ? new Date(dueDate) : new Date();
  if (Number.isNaN(base.getTime())) return null;

  if (recurring === 'daily') base.setDate(base.getDate() + 1);
  if (recurring === 'weekly') base.setDate(base.getDate() + 7);
  if (recurring === 'monthly') base.setMonth(base.getMonth() + 1);

  return base.toISOString().slice(0, 10);
};

const AUTO_ARCHIVE_DAYS = 14;
const LAST_ARCHIVE_CHECK_KEY = (userId) => `zenboard-archive-check-${userId}`;

/** Load tasks dari localStorage berdasarkan userId */
const loadTasks = (userId) => {
  try {
    const raw = localStorage.getItem(getTasksKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backward compatibility: ensure old tasks get subtasks field
    return parsed.map((task) => ({
      ...task,
      recurring: normalizeRecurring(task.recurring),
      tags: normalizeTags(task.tags),
      archivedAt: task.archivedAt ?? null,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
    }));
  } catch {
    return [];
  }
};

/** Save tasks ke localStorage untuk userId tertentu */
const saveTasks = (userId, tasks) => {
  try {
    localStorage.setItem(getTasksKey(userId), JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

export default function useTasks() {
  const { currentUser } = useAuth();
  const userId = currentUser?.userId ?? null;

  // State tasks diinisialisasi dari localStorage sesuai user yang login
  const [tasks, setTasks] = useState(() => {
    if (!userId) return [];
    return loadTasks(userId);
  });

  // Saat user berganti (login akun berbeda), muat ulang tasks milik user tersebut
  useEffect(() => {
    if (userId) {
      setTasks(loadTasks(userId));
    } else {
      setTasks([]);
    }
  }, [userId]);

  // Simpan ke localStorage setiap kali tasks berubah (hanya jika user aktif)
  useEffect(() => {
    if (userId) {
      saveTasks(userId, tasks);
    }
  }, [tasks, userId]);

  // Auto-archive completed tasks older than AUTO_ARCHIVE_DAYS (once per day per user)
  useEffect(() => {
    if (!userId) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const lastChecked = localStorage.getItem(LAST_ARCHIVE_CHECK_KEY(userId));
    if (lastChecked === todayKey) return;

    const cutoff = Date.now() - AUTO_ARCHIVE_DAYS * 24 * 60 * 60 * 1000;
    let changed = false;
    const nextTasks = tasks.map((task) => {
      if (!task.completed || task.archivedAt) return task;
      const completedAtMs = task.completedAt ? new Date(task.completedAt).getTime() : NaN;
      if (Number.isNaN(completedAtMs) || completedAtMs > cutoff) return task;
      changed = true;
      return { ...task, archivedAt: new Date().toISOString() };
    });

    localStorage.setItem(LAST_ARCHIVE_CHECK_KEY(userId), todayKey);
    if (changed) setTasks(nextTasks);
  }, [tasks, userId]);

  /** Tambah task baru */
  const addTask = useCallback((title, category = 'Personal', priority = 'Medium', dueDate = null, recurring = 'none', tags = []) => {
    if (!title.trim()) return;
    const newTask = {
      id:          Date.now().toString(),
      title:       title.trim(),
      category,
      priority,
      dueDate:     dueDate || null,
      recurring:   normalizeRecurring(recurring),
      tags:       normalizeTags(tags),
      pinned:      false,
      subtasks:    [],
      completed:   false,
      createdAt:   new Date().toISOString(),
      completedAt: null,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  /** Toggle status selesai/belum */
  const toggleTask = useCallback((id) => {
    setTasks((prev) => {
      const taskToToggle = prev.find((t) => t.id === id);
      if (!taskToToggle) return prev;

      const nextCompleted = !taskToToggle.completed;
      const updated = prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : null,
            }
          : task
      );

      // If recurring task just completed, create the next instance automatically.
      if (
        nextCompleted &&
        normalizeRecurring(taskToToggle.recurring) !== 'none'
      ) {
        const nextDueDate = getNextDueDate(taskToToggle.dueDate, taskToToggle.recurring);
        const nextTask = {
          ...taskToToggle,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          dueDate: nextDueDate,
          completed: false,
          completedAt: null,
          pinned: false,
          subtasks: Array.isArray(taskToToggle.subtasks)
            ? taskToToggle.subtasks.map((subtask) => ({ ...subtask, completed: false }))
            : [],
          createdAt: new Date().toISOString(),
        };
        return [nextTask, ...updated];
      }

      return updated;
    });
  }, []);

  /** Hapus task */
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  /** Archive task manually */
  const archiveTask = useCallback((id) => {
    setTasks((prev) => prev.map((task) => (
      task.id === id ? { ...task, archivedAt: new Date().toISOString() } : task
    )));
  }, []);

  /** Restore archived task */
  const restoreTask = useCallback((id) => {
    setTasks((prev) => prev.map((task) => (
      task.id === id ? { ...task, archivedAt: null } : task
    )));
  }, []);

  /** Edit field task */
  const editTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            ...updates,
            recurring: updates.recurring ? normalizeRecurring(updates.recurring) : t.recurring,
            tags: updates.tags ? normalizeTags(updates.tags) : t.tags,
          }
        : t
    ));
  }, []);

  /** Pin/unpin task agar muncul di atas */
  const togglePin = useCallback((id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, pinned: !t.pinned } : t
    ));
  }, []);

  /** Hapus semua task yang sudah selesai */
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.completed));
  }, []);

  /** Tambah subtask/checklist ke task tertentu */
  const addSubtask = useCallback((taskId, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setTasks((prev) => prev.map((task) => {
      if (task.id !== taskId) return task;
      const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      return {
        ...task,
        subtasks: [
          ...currentSubtasks,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            title: trimmed,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }));
  }, []);

  /** Toggle status subtask */
  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== taskId) return task;
      const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      return {
        ...task,
        subtasks: currentSubtasks.map((subtask) => (
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )),
      };
    }));
  }, []);

  /** Hapus subtask dari task */
  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== taskId) return task;
      const currentSubtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      return {
        ...task,
        subtasks: currentSubtasks.filter((subtask) => subtask.id !== subtaskId),
      };
    }));
  }, []);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    archiveTask,
    restoreTask,
    editTask,
    togglePin,
    clearCompleted,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}