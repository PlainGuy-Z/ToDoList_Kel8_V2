import { useState, useRef, useEffect } from 'react';

const PRIORITY_COLORS = {
  High:   'border-l-zen-priority-high',
  Medium: 'border-l-zen-priority-med',
  Low:    'border-l-zen-priority-low',
};

const CATEGORY_STYLES = {
  Work:     'bg-zen-rose-soft    text-zen-rose  dark:bg-zen-rose/20  dark:text-zen-rose',
  Study:    'bg-zen-sand-soft    text-zen-sand  dark:bg-zen-sand/20  dark:text-zen-sand',
  Personal: 'bg-zen-sage-soft    text-zen-sage  dark:bg-zen-sage/20  dark:text-zen-sage',
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing,  setIsEditing]  = useState(false);
  const [editTitle,  setEditTitle]  = useState(task.title);
  const [isRemoving, setIsRemoving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (task.completed) return;
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  handleSaveEdit();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setIsRemoving(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const priorityBorder = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.Medium;
  const categoryStyle  = CATEGORY_STYLES[task.category] ?? CATEGORY_STYLES.Personal;

  // Due date overdue check: compare date strings to avoid timezone issues
  const isOverdue = task.dueDate && !task.completed &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();

  return (
    <div
      className={`
        zen-card border-l-4 ${priorityBorder}
        p-4 flex items-center gap-3 group
        overflow-hidden zen-fade-in
        ${isRemoving  ? 'opacity-0 -translate-x-5 scale-95' : ''}
        ${task.completed ? 'opacity-60' : ''}
      `}
      style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
    >

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2
          flex items-center justify-center cursor-pointer
          transition-all duration-300
          ${task.completed
            ? 'bg-zen-sage border-zen-sage'
            : 'border-zen-border dark:border-zen-border-dark hover:border-zen-sage'}
        `}
        title={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {task.completed && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="zen-input py-1 px-2 text-sm w-full"
          />
        ) : (
          <p
            className={`
              text-sm font-medium truncate cursor-default
              text-zen-text dark:text-zen-text-dark
              ${task.completed ? 'line-through text-zen-muted dark:text-zen-muted-dark' : ''}
            `}
            onDoubleClick={handleDoubleClick}
            title={task.title}
          >
            {task.title}
          </p>
        )}

        {/* Meta: category badge + priority + due date pill */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap overflow-hidden">
          <span className={`zen-badge flex-shrink-0 ${categoryStyle}`}>
            {task.category}
          </span>
          <span className="text-xs text-zen-muted dark:text-zen-muted-dark flex-shrink-0">
            {task.priority}
          </span>

          {/* Due date pill */}
          {task.dueDate && (
            <span
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0
                ${isOverdue
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
              `}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              {new Date(task.dueDate).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1.5 rounded-lg cursor-pointer
          hover:bg-red-50 dark:hover:bg-red-900/20
          transition-all duration-200
        "
        title="Hapus tugas"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="text-zen-priority-high">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>

    </div>
  );
}