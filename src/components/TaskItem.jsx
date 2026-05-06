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

const CATEGORIES = ['Work', 'Study', 'Personal'];
const PRIORITIES  = ['High', 'Medium', 'Low'];
const RECURRENCES = ['none', 'daily', 'weekly', 'monthly'];
const RECURRENCE_LABELS = {
  none: 'Tidak berulang',
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  onTogglePin,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}) {
  const [isEditing,  setIsEditing]  = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Edit field states — initialised when edit mode opens
  const [editTitle,    setEditTitle]    = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate,  setEditDueDate]  = useState(task.dueDate ?? '');
  const [editRecurring, setEditRecurring] = useState(task.recurring ?? 'none');
  const [editTags, setEditTags] = useState(Array.isArray(task.tags) ? task.tags.join(', ') : '');

  const inputRef = useRef(null);

  // Focus title input when edit panel opens
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Keep local state in sync if parent updates the task prop
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditCategory(task.category);
      setEditPriority(task.priority);
      setEditDueDate(task.dueDate ?? '');
      setEditRecurring(task.recurring ?? 'none');
      setEditTags(Array.isArray(task.tags) ? task.tags.join(', ') : '');
    }
  }, [task, isEditing]);

  const handleOpenEdit = () => {
    if (task.completed) return;
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ?? '');
    setEditRecurring(task.recurring ?? 'none');
    setEditTags(Array.isArray(task.tags) ? task.tags.join(', ') : '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return; // don't save empty title

    const changes = {};
    if (trimmed            !== task.title)    changes.title    = trimmed;
    if (editCategory       !== task.category) changes.category = editCategory;
    if (editPriority       !== task.priority) changes.priority = editPriority;
    if (editRecurring      !== (task.recurring ?? 'none')) changes.recurring = editRecurring;
    const parsedTags = editTags.split(',').map((tag) => tag.trim()).filter(Boolean);
    const existingTags = Array.isArray(task.tags) ? task.tags : [];
    if (JSON.stringify(parsedTags) !== JSON.stringify(existingTags)) changes.tags = parsedTags;
    // normalise empty string → null to stay consistent with original data shape
    const newDue = editDueDate || null;
    if (newDue !== (task.dueDate ?? null))    changes.dueDate  = newDue;

    if (Object.keys(changes).length > 0) {
      onEdit(task.id, changes);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter')  handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleDelete = () => {
    setIsRemoving(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const handleAddSubtask = () => {
    if (!onAddSubtask || !newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle);
    setNewSubtaskTitle('');
    setShowSubtasks(true);
  };

  const priorityBorder = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.Medium;
  const categoryStyle  = CATEGORY_STYLES[task.category] ?? CATEGORY_STYLES.Personal;
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length;

  const isOverdue = task.dueDate && !task.completed &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < Date.now();

  return (
    <div
      className={`
        zen-card border-l-4 ${priorityBorder}
        overflow-hidden zen-fade-in
        ${isRemoving   ? 'opacity-0 -translate-x-5 scale-95' : ''}
        ${task.completed && !isEditing ? 'opacity-60' : ''}
      `}
      style={{ transition: 'opacity 0.3s ease, transform 0.3s ease' }}
    >
      {/* ── Normal view row ─────────────────────────────────────────── */}
      <div className="p-4 flex items-center gap-3 group">

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
          <p
            className={`
              text-sm font-medium truncate
              text-zen-text dark:text-zen-text-dark
              ${task.completed ? 'line-through text-zen-muted dark:text-zen-muted-dark' : 'cursor-default'}
            `}
            title={task.title}
          >
            {task.title}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap overflow-hidden">
            <span className={`zen-badge flex-shrink-0 ${categoryStyle}`}>
              {task.category}
            </span>
            <span className="text-xs text-zen-muted dark:text-zen-muted-dark flex-shrink-0">
              {task.priority}
            </span>

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

            {task.recurring && task.recurring !== 'none' && (
              <span className="text-xs text-zen-muted dark:text-zen-muted-dark flex-shrink-0">
                {RECURRENCE_LABELS[task.recurring] ?? 'Berulang'}
              </span>
            )}

            {Array.isArray(task.tags) && task.tags.length > 0 && task.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-zen-surface-hover dark:bg-zen-surface-hover-dark text-zen-muted dark:text-zen-muted-dark">
                #{tag}
              </span>
            ))}

            {subtasks.length > 0 && (
              <span className="text-xs text-zen-muted dark:text-zen-muted-dark flex-shrink-0">
                Checklist {completedSubtasks}/{subtasks.length}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Pin button */}
          {onTogglePin && !task.completed && (
            <button
              onClick={() => onTogglePin(task.id)}
              className="
                flex-shrink-0 p-1.5 rounded-lg cursor-pointer
                hover:bg-amber-50 dark:hover:bg-amber-900/20
                transition-all duration-200
              "
              title={task.pinned ? 'Lepas pin tugas' : 'Pin tugas ini'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={task.pinned ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={task.pinned ? 'text-amber-500' : 'text-zen-muted'}>
                <path d="M12 17v5"/>
                <path d="M5 3v4l5 5v5l4-2v-3l5-5V3z"/>
              </svg>
            </button>
          )}

          {onAddSubtask && (
            <button
              onClick={() => setShowSubtasks((prev) => !prev)}
              className="
                flex-shrink-0 p-1.5 rounded-lg cursor-pointer
                hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark
                transition-all duration-200
              "
              title={showSubtasks ? 'Sembunyikan checklist' : 'Buka checklist'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-zen-muted">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </button>
          )}

          {/* Edit button — only when not completed */}
          {!task.completed && (
            <button
              onClick={handleOpenEdit}
              className="
                flex-shrink-0 p-1.5 rounded-lg cursor-pointer
                hover:bg-blue-50 dark:hover:bg-blue-900/20
                transition-all duration-200
              "
              title="Edit tugas"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="text-blue-500">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="
              flex-shrink-0 p-1.5 rounded-lg cursor-pointer
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
      </div>

      {/* ── Subtasks panel ───────────────────────────────────────────── */}
      {showSubtasks && !isEditing && onAddSubtask && (
        <div
          className="
            border-t border-zen-border dark:border-zen-border-dark
            bg-zen-surface dark:bg-zen-surface-dark
            px-4 pb-4 pt-3 flex flex-col gap-3
          "
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              className="zen-input py-1.5 px-3 text-sm w-full"
              placeholder="Tambah checklist..."
              disabled={task.completed}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="zen-btn-secondary px-4 py-1.5 text-sm"
              disabled={task.completed}
            >
              Tambah
            </button>
          </div>

          {subtasks.length === 0 ? (
            <p className="text-xs text-zen-muted dark:text-zen-muted-dark">
              Belum ada checklist untuk tugas ini.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zen-border dark:border-zen-border-dark px-3 py-2"
                >
                  <label className="flex items-center gap-2 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => onToggleSubtask?.(task.id, subtask.id)}
                      className="accent-zen-sage"
                      disabled={task.completed}
                    />
                    <span
                      className={`text-sm truncate ${
                        subtask.completed
                          ? 'line-through text-zen-muted dark:text-zen-muted-dark'
                          : 'text-zen-text dark:text-zen-text-dark'
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onDeleteSubtask?.(task.id, subtask.id)}
                    className="text-xs text-zen-priority-high hover:underline"
                    disabled={task.completed}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Inline edit panel ───────────────────────────────────────── */}
      {isEditing && (
        <div
          className="
            border-t border-zen-border dark:border-zen-border-dark
            bg-zen-surface dark:bg-zen-surface-dark
            px-4 pb-4 pt-3 flex flex-col gap-3
          "
        >
          {/* Title */}
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            className="zen-input py-1.5 px-3 text-sm w-full"
            placeholder="Judul tugas"
          />

          <input
            type="text"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
            className="zen-input py-1.5 px-3 text-sm w-full"
            placeholder="Tag (pisahkan dengan koma)"
          />

          {/* Category · Priority · Due date  — responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

            {/* Category */}
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="zen-input text-sm cursor-pointer"
              style={{ height: '36px' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="zen-input text-sm cursor-pointer"
              style={{ height: '36px' }}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Due date */}
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="zen-input text-sm cursor-pointer"
              style={{ height: '36px' }}
            />

            <select
              value={editRecurring}
              onChange={(e) => setEditRecurring(e.target.value)}
              className="zen-input text-sm cursor-pointer"
              style={{ height: '36px' }}
            >
              {RECURRENCES.map((value) => (
                <option key={value} value={value}>
                  {RECURRENCE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="
                px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer
                border border-zen-border dark:border-zen-border-dark
                text-zen-muted hover:text-zen-text dark:hover:text-zen-text-dark
                hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark
                transition-all duration-200
              "
            >
              Batal
            </button>
            <button
              onClick={handleSaveEdit}
              className="
                px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer
                bg-zen-sage text-white
                hover:opacity-90 active:scale-95
                transition-all duration-200
              "
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}