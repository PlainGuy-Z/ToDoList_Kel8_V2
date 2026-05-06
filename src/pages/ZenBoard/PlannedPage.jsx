import { useMemo, useState } from 'react';
import useTasks from '../../hooks/useTasks';
import TaskItem from '../../components/TaskItem';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getWeekStart = (date) => {
  const current = startOfDay(date);
  current.setDate(current.getDate() - current.getDay());
  return current;
};

export default function PlannedPage() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    editTask,
    togglePin,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks();

  const [viewMode, setViewMode] = useState('monthly');
  const [currentMonth, setCurrentMonth] = useState(() => startOfDay(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));

  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach((task) => {
      if (!task.dueDate) return;
      if (!grouped[task.dueDate]) grouped[task.dueDate] = [];
      grouped[task.dueDate].push(task);
    });

    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0);
      });
    });

    return grouped;
  }, [tasks]);

  const monthDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const start = getWeekStart(firstDayOfMonth);
    return Array.from({ length: 42 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [currentMonth]);

  const weeklyDays = useMemo(() => {
    const selectedDate = parseDateKey(selectedDateKey);
    const start = getWeekStart(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [selectedDateKey]);

  const selectedTasks = tasksByDate[selectedDateKey] ?? [];
  const selectedDate = parseDateKey(selectedDateKey);

  const changeMonth = (delta) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
    setCurrentMonth(next);
  };

  const renderDayCell = (day, compact = false) => {
    const key = toDateKey(day);
    const isSelected = key === selectedDateKey;
    const isToday = key === toDateKey(new Date());
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    const count = tasksByDate[key]?.length ?? 0;

    return (
      <button
        key={key}
        type="button"
        onClick={() => setSelectedDateKey(key)}
        className={`
          rounded-xl border text-left transition-all duration-200
          ${compact ? 'p-2 min-h-[80px]' : 'p-3 min-h-[96px]'}
          ${isSelected
            ? 'border-zen-sage bg-zen-sage-soft dark:bg-zen-sage/20'
            : 'border-zen-border dark:border-zen-border-dark bg-zen-surface dark:bg-zen-surface-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark'
          }
          ${!isCurrentMonth && !compact ? 'opacity-50' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isToday ? 'text-zen-sage' : 'text-zen-text dark:text-zen-text-dark'}`}>
            {day.getDate()}
          </span>
          {count > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zen-sand-soft text-zen-text dark:bg-zen-sand/20 dark:text-zen-text-dark">
              {count}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 zen-fade-in">
      <section className="zen-slide-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
            Planned
          </h1>
          <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
            Rencanakan tugas per tanggal dalam tampilan mingguan atau bulanan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`zen-btn-secondary ${viewMode === 'weekly' ? 'border-zen-sage text-zen-sage' : ''}`}
          >
            Mingguan
          </button>
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`zen-btn-secondary ${viewMode === 'monthly' ? 'border-zen-sage text-zen-sage' : ''}`}
          >
            Bulanan
          </button>
        </div>
      </section>

      <section className="zen-card p-4 sm:p-5 space-y-4 zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between">
          <button type="button" className="zen-btn-secondary px-3 py-1.5" onClick={() => changeMonth(-1)}>
            ←
          </button>
          <h2 className="text-lg font-semibold text-zen-text dark:text-zen-text-dark">
            {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </h2>
          <button type="button" className="zen-btn-secondary px-3 py-1.5" onClick={() => changeMonth(1)}>
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((label) => (
            <div key={label} className="text-xs font-medium text-center text-zen-muted dark:text-zen-muted-dark">
              {label}
            </div>
          ))}
        </div>

        {viewMode === 'monthly' ? (
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => renderDayCell(day))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {weeklyDays.map((day) => renderDayCell(day, true))}
          </div>
        )}
      </section>

      <section className="zen-slide-up space-y-3" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zen-text dark:text-zen-text-dark">
            Tugas tanggal {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <span className="text-xs text-zen-muted dark:text-zen-muted-dark">
            {selectedTasks.length} tugas
          </span>
        </div>

        {selectedTasks.length === 0 ? (
          <div className="zen-card p-8 text-sm text-center text-zen-muted dark:text-zen-muted-dark">
            Tidak ada task dengan due date di tanggal ini.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedTasks.map((task) => (
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
      </section>
    </div>
  );
}
