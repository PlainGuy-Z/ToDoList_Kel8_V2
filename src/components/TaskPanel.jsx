import { useState, useMemo } from 'react';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskItem from './TaskItem';

/**
 * TaskPanel — task list with form, filters, and grouped display.
 *
 * FIX: Removed rigid maxHeight calc. Now uses flex layout that
 * adapts to available space without overflowing containers.
 * Active tasks rendered above completed tasks with a divider.
 */
export default function TaskPanel({ tasks, addTask, toggleTask, deleteTask, editTask }) {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus]     = useState('All');

  // Apply combined filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'All' && t.category !== category) return false;
      if (status === 'Active'    &&  t.completed) return false;
      if (status === 'Completed' && !t.completed) return false;
      return true;
    });
  }, [tasks, search, category, status]);

  // Split into active and completed groups
  const activeTasks    = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t =>  t.completed);

  const activeCount    = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t =>  t.completed).length;

  return (
    <div className="flex flex-col gap-5 zen-slide-up" style={{ animationDelay: '0.1s' }}>

      {/* Section heading */}
      <div className="px-1">
        <h2 className="text-xl font-semibold text-zen-text dark:text-zen-text-dark">
          Tugas Saya
        </h2>
        <p className="text-zen-muted dark:text-zen-muted-dark text-sm mt-0.5">
          {activeCount} aktif · {completedCount} selesai
        </p>
      </div>

      {/* Task form */}
      <TaskForm onAdd={addTask} />

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
      />

      {/* Task list — no fixed maxHeight, scrolls naturally */}
      <div className="flex flex-col gap-1">

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="zen-card p-10 text-center zen-fade-in">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-zen-muted dark:text-zen-muted-dark text-sm font-medium">
              {tasks.length === 0
                ? 'Belum ada tugas. Mulai dengan menambahkan satu!'
                : 'Tidak ada yang cocok. Coba ubah filter 🍃'}
            </p>
          </div>
        )}

        {/* Active tasks */}
        {activeTasks.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {activeTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 0.04}s` }}>
                <TaskItem
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              </div>
            ))}
          </div>
        )}

        {/* Divider + Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-4">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="h-px flex-1 bg-zen-border dark:bg-zen-border-dark" />
              <span className="text-xs text-zen-muted dark:text-zen-muted-dark font-medium whitespace-nowrap">
                Selesai · {completedTasks.length}
              </span>
              <div className="h-px flex-1 bg-zen-border dark:bg-zen-border-dark" />
            </div>

            {/* Completed list */}
            <div className="flex flex-col gap-2.5">
              {completedTasks.map((task, index) => (
                <div key={task.id} style={{ animationDelay: `${index * 0.04}s` }}>
                  <TaskItem
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}