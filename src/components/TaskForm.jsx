import { useState } from 'react';

const CATEGORIES = ['Work', 'Study', 'Personal'];
const PRIORITIES  = ['High', 'Medium', 'Low'];
const RECURRENCES = ['none', 'daily', 'weekly', 'monthly'];
const CATEGORY_LABELS = { Work: 'Pekerjaan', Study: 'Belajar', Personal: 'Pribadi' };
const PRIORITY_LABELS = { High: 'Tinggi', Medium: 'Sedang', Low: 'Rendah' };
const RECURRENCE_LABELS = {
  none: 'Tidak berulang',
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

/**
 * TaskForm — task creation form.
 */
export default function TaskForm({ onAdd }) {
  const [title,    setTitle]    = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [recurring, setRecurring] = useState('none');
  const [dueDate,  setDueDate]  = useState('');   // ← pindah ke dalam komponen
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    onAdd(title.trim(), category, priority, dueDate || null, recurring, tags);
    setTitle('');
    setDueDate('');
    setRecurring('none');
    setTagsInput('');
  };

  const inputHeight = { height: '44px' };

  return (
    <form
      onSubmit={handleSubmit}
      className="zen-card p-4 sm:p-5 zen-fade-in flex flex-col gap-4"
      id="task-form"
    >
      <div className="space-y-1.5">
        <label
          htmlFor="task-title-input"
          className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
        >
          Judul tugas
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Contoh: Selesaikan laporan bulanan"
          className="zen-input w-full"
          style={inputHeight}
          id="task-title-input"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="task-due-date-input"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Tenggat
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="zen-input w-full cursor-pointer"
            style={inputHeight}
            id="task-due-date-input"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="task-category-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="zen-input w-full cursor-pointer"
            style={inputHeight}
            id="task-category-select"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="task-priority-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Prioritas
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="zen-input w-full cursor-pointer"
            style={inputHeight}
            id="task-priority-select"
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="task-recurring-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Berulang
          </label>
          <select
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
            className="zen-input w-full cursor-pointer"
            style={inputHeight}
            id="task-recurring-select"
          >
            {RECURRENCES.map((value) => (
              <option key={value} value={value}>
                {RECURRENCE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="task-tags-input"
          className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
        >
          Tag
        </label>
        <input
          id="task-tags-input"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="zen-input w-full"
          placeholder="Contoh: kampus, urgent, klien-a"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="zen-btn-primary flex items-center justify-center w-full sm:w-auto px-6 whitespace-nowrap"
          style={inputHeight}
          id="add-task-btn"
        >
          <span>Tambah Tugas</span>
        </button>
      </div>
    </form>
  );
}