import { useState, useMemo } from 'react';
import useTasks from '../../hooks/useTasks';
import TaskForm from '../../components/TaskForm';
import TaskFilters from '../../components/TaskFilters';
import TaskItem from '../../components/TaskItem';

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, editTask } = useTasks();
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'All' && t.category !== category) return false;
      if (status === 'Active' && t.completed) return false;
      if (status === 'Completed' && !t.completed) return false;
      return true;
    });
  }, [tasks, search, category, status]);

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 zen-fade-in">
      {/* 1. Header */}
      <section className="zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          My Tasks
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          {tasks.length} total tasks · {tasks.filter(t=>t.completed).length} completed
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
        />
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
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
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
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
