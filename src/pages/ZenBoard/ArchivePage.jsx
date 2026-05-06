import useTasks from '../../hooks/useTasks';
import TaskItem from '../../components/TaskItem';

export default function ArchivePage() {
  const { tasks, restoreTask, deleteTask, toggleTask, editTask, togglePin, addSubtask, toggleSubtask, deleteSubtask } = useTasks();
  const archivedTasks = tasks
    .filter((task) => task.archivedAt)
    .sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime());

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 zen-fade-in">
      <section className="zen-slide-up">
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          Archive
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          {archivedTasks.length} task diarsipkan. Kamu bisa restore kapan saja.
        </p>
      </section>

      {archivedTasks.length === 0 ? (
        <div className="zen-card p-8 text-center text-zen-muted dark:text-zen-muted-dark">
          Belum ada task yang diarsipkan.
        </div>
      ) : (
        <div className="space-y-3">
          {archivedTasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <TaskItem
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onTogglePin={togglePin}
                onAddSubtask={addSubtask}
                onToggleSubtask={toggleSubtask}
                onDeleteSubtask={deleteSubtask}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="zen-btn-secondary"
                  onClick={() => restoreTask(task.id)}
                >
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
