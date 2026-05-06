import { useState, useMemo } from 'react';
import useTasks from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm';
import TaskFilters from '../../components/TaskFilters';
import TaskItem from '../../components/TaskItem';

export default function TasksPage() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    togglePin,
    clearCompleted,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [tag, setTag] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  const tagOptions = useMemo(() => {
    const unique = new Set();
    tasks.forEach((task) => {
      (task.tags ?? []).forEach((item) => unique.add(item));
    });
    return [...unique].sort();
  }, [tasks]);

  const activePool = useMemo(() => tasks.filter((t) => !t.archivedAt), [tasks]);

  const filteredTasks = useMemo(() => {
    return activePool.filter(t => {
      if (t.archivedAt) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'All' && t.category !== category) return false;
      if (status === 'Active' && t.completed) return false;
      if (status === 'Completed' && !t.completed) return false;
      if (tag !== 'All' && !(t.tags ?? []).includes(tag)) return false;
      return true;
    });
  }, [activePool, search, category, status, tag]);

  const recurringHabits = useMemo(() => {
    const keyMap = new Map();
    tasks.forEach((task) => {
      if (!task.recurring || task.recurring === 'none') return;
      const key = `${task.title}__${task.recurring}`;
      if (!keyMap.has(key)) {
        keyMap.set(key, { name: task.title, recurring: task.recurring, completedDates: [] });
      }
      if (task.completedAt) {
        keyMap.get(key).completedDates.push(new Date(task.completedAt));
      }
    });

    const calculateStreak = (dates, recurringType) => {
      if (dates.length === 0) return 0;
      const sortAsc = [...dates].sort((a, b) => a.getTime() - b.getTime());
      let streak = 1;
      for (let i = sortAsc.length - 1; i > 0; i -= 1) {
        const current = sortAsc[i];
        const prev = sortAsc[i - 1];
        const diffDays = Math.round((startOfDay(current) - startOfDay(prev)) / (1000 * 60 * 60 * 24));
        if (recurringType === 'daily' && diffDays === 1) streak += 1;
        else if (recurringType === 'weekly' && diffDays >= 6 && diffDays <= 8) streak += 1;
        else if (recurringType === 'monthly' && current.getMonth() - prev.getMonth() + 12 * (current.getFullYear() - prev.getFullYear()) === 1) streak += 1;
        else break;
      }
      return streak;
    };

    function startOfDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    return [...keyMap.values()]
      .map((habit) => ({
        ...habit,
        streak: calculateStreak(habit.completedDates, habit.recurring),
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const parseDate = (value) => {
      if (!value) return Number.POSITIVE_INFINITY;
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
    };

    const byRecent = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

    return [...filteredTasks].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sortBy === 'priority') return (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0) || byRecent(a, b);
      if (sortBy === 'due') return parseDate(a.dueDate) - parseDate(b.dueDate) || byRecent(a, b);
      return byRecent(a, b);
    });
  }, [filteredTasks, sortBy]);

  const activeTasks = sortedTasks.filter(t => !t.completed);
  const completedTasks = sortedTasks.filter(t => t.completed);
  const hasCompleted = tasks.some(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 zen-fade-in">
      {/* 1. Header */}
      <section className="zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          My Tasks
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          {activePool.length} total tasks · {activePool.filter(t=>t.completed).length} completed
        </p>
      </section>

      {/* 2. Add Task Form */}
      <section className="zen-slide-up" style={{ animationDelay: '0.1s' }}>
        <TaskForm onAdd={addTask} />
      </section>

      {/* 3. Filter Bar */}
      <section className="zen-slide-up" style={{ animationDelay: '0.15s' }}>
        <TaskFilters 
          search={search} onSearchChange={setSearch}
          category={category} onCategoryChange={setCategory}
          status={status} onStatusChange={setStatus}
          tag={tag} onTagChange={setTag}
          tagOptions={tagOptions}
        />
      </section>

      {recurringHabits.length > 0 && (
        <section className="zen-slide-up" style={{ animationDelay: '0.17s' }}>
          <div className="zen-card p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-zen-text dark:text-zen-text-dark mb-2">
              Habit Tracker (Recurring)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recurringHabits.map((habit) => (
                <div key={`${habit.name}-${habit.recurring}`} className="rounded-xl border border-zen-border dark:border-zen-border-dark px-3 py-2">
                  <p className="text-sm font-medium text-zen-text dark:text-zen-text-dark truncate">{habit.name}</p>
                  <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
                    {habit.recurring} · 🔥 {habit.streak} streak
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="zen-slide-up" style={{ animationDelay: '0.18s' }}>
        <div className="zen-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
          <div className="w-full sm:w-64 space-y-1.5">
            <label
              htmlFor="sort-task-select"
              className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
            >
              Urutkan tugas
            </label>
            <select
              id="sort-task-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="zen-input"
            >
              <option value="recent">Terbaru dibuat</option>
              <option value="priority">Prioritas tertinggi</option>
              <option value="due">Deadline terdekat</option>
            </select>
          </div>

          {hasCompleted && (
            <button
              type="button"
              onClick={clearCompleted}
              className="zen-btn-secondary w-full sm:w-auto"
            >
              Hapus semua yang selesai
            </button>
          )}
        </div>
      </section>

      {/* 4. Task List */}
      <section className="zen-slide-up space-y-6" style={{ animationDelay: '0.2s' }}>
        {filteredTasks.length === 0 ? (
          <div className="zen-card p-12 text-center text-zen-muted dark:text-zen-muted-dark border-dashed">
            <span className="text-3xl block mb-3">🌿</span>
            <p>Nothing here. Time to rest.</p>
          </div>
        ) : (
          <>
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {activeTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onTogglePin={togglePin}
                    onAddSubtask={addSubtask}
                    onToggleSubtask={toggleSubtask}
                    onDeleteSubtask={deleteSubtask}
                  />
                ))}
              </div>
            )}

            {/* Divider for completed tasks */}
            {activeTasks.length > 0 && completedTasks.length > 0 && (
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-zen-border dark:bg-zen-border-dark"></div>
                <span className="text-xs font-medium text-zen-muted dark:text-zen-muted-dark uppercase tracking-wider">Completed</span>
                <div className="flex-1 h-px bg-zen-border dark:bg-zen-border-dark"></div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="flex flex-col gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onTogglePin={togglePin}
                    onAddSubtask={addSubtask}
                    onToggleSubtask={toggleSubtask}
                    onDeleteSubtask={deleteSubtask}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
