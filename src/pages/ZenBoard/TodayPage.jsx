import { useMemo } from 'react';
import useTasks from '../../hooks/useTasks';
import TaskItem from '../../components/TaskItem';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function TodayPage() {
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

  const { overdueTasks, todayTasks } = useMemo(() => {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const activeWithDueDate = tasks.filter((task) => !task.completed && !task.archivedAt && task.dueDate);

    const overdue = [];
    const today = [];

    activeWithDueDate.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      if (Number.isNaN(dueDate.getTime())) return;

      if (dueDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        overdue.push(task);
        return;
      }

      if (isSameDay(dueDate, now) || dueDate <= endOfToday) {
        today.push(task);
      }
    });

    const sortByPriorityThenPinned = (a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0);
    };

    overdue.sort(sortByPriorityThenPinned);
    today.sort(sortByPriorityThenPinned);

    return { overdueTasks: overdue, todayTasks: today };
  }, [tasks]);

  const totalDueToday = overdueTasks.length + todayTasks.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 zen-fade-in">
      <section className="zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          Today
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          {totalDueToday} tugas perlu perhatian hari ini
        </p>
      </section>

      {totalDueToday === 0 && (
        <div className="zen-card p-10 text-center text-zen-muted dark:text-zen-muted-dark">
          Tidak ada deadline hari ini. Kerja bagus.
        </div>
      )}

      {overdueTasks.length > 0 && (
        <section className="space-y-3 zen-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zen-priority-high">
              Overdue
            </h2>
            <span className="text-xs text-zen-muted dark:text-zen-muted-dark">
              {overdueTasks.length} tugas
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {overdueTasks.map((task) => (
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
        </section>
      )}

      {todayTasks.length > 0 && (
        <section className="space-y-3 zen-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zen-text dark:text-zen-text-dark">
              Due Today
            </h2>
            <span className="text-xs text-zen-muted dark:text-zen-muted-dark">
              {todayTasks.length} tugas
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {todayTasks.map((task) => (
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
        </section>
      )}
    </div>
  );
}
