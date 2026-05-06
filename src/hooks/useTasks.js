import { useState, useEffect, useCallback } from 'react';

const TASKS_KEY = 'zenboard-tasks';

/** Load tasks from localStorage */
const loadTasks = () => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Validate: must be an array of objects
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Save tasks to localStorage */
const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

/**
 * useTasks — single-user task management hook.
 *
 * FIX: Removed the flaky `initialized` ref pattern.
 * Instead, we initialize state directly from localStorage (lazy initializer),
 * so the save effect runs correctly on every change without race conditions.
 */
export default function useTasks() {
  // Lazy initializer: runs once on mount, reads localStorage synchronously
  const [tasks, setTasks] = useState(() => loadTasks());

  // Save to localStorage on every tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  /** Add a new task */
// Ubah baris addTask:
const addTask = useCallback((title, category = 'Personal', priority = 'Medium', dueDate = null) => {
  if (!title.trim()) return;
  const newTask = {
    id: Date.now().toString(),
    title: title.trim(),
    category,
    priority,
    dueDate: dueDate || null,          // ← tambah ini
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  setTasks(prev => [newTask, ...prev]);
}, []);

  /** Toggle task completion */
  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : null
          }
        : t
    ));
  }, []);

  /** Delete a task */
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  /** Edit task fields (title or any other field) */
  const editTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, editTask };
}