import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * useTasks — multi-user task management hook.
 * Data task disimpan per-user menggunakan key: 'zenboard-tasks-{userId}'
 * sehingga setiap akun memiliki data task yang terisolasi.
 */

/** Buat localStorage key unik untuk setiap user */
const getTasksKey = (userId) => `zenboard-tasks-${userId}`;

/** Load tasks dari localStorage berdasarkan userId */
const loadTasks = (userId) => {
  try {
    const raw = localStorage.getItem(getTasksKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

  /** Tambah task baru */
  const addTask = useCallback((title, category = 'Personal', priority = 'Medium', dueDate = null) => {
    if (!title.trim()) return;
    const newTask = {
      id:          Date.now().toString(),
      title:       title.trim(),
      category,
      priority,
      dueDate:     dueDate || null,
      completed:   false,
      createdAt:   new Date().toISOString(),
      completedAt: null,
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  /** Toggle status selesai/belum */
  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? {
            ...t,
            completed:   !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : null,
          }
        : t
    ));
  }, []);

  /** Hapus task */
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  /** Edit field task */
  const editTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, editTask };
}