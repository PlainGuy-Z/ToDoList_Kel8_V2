import { useState } from 'react';

const CATEGORIES = ['Work', 'Study', 'Personal'];
const PRIORITIES  = ['High', 'Medium', 'Low'];

/**
 * TaskForm — task creation form.
 */
export default function TaskForm({ onAdd }) {
  const [title,    setTitle]    = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate,  setDueDate]  = useState('');   // ← pindah ke dalam komponen

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category, priority, dueDate || null);
    setTitle('');
    setDueDate('');
  };

  const inputHeight = { height: '44px' };

  return (
    <form
      onSubmit={handleSubmit}
      className="zen-card p-4 sm:p-5 zen-fade-in flex flex-col gap-3"
      id="task-form"
    >
      {/* Row 1: Title — full width */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        placeholder="Apa yang ingin kamu kerjakan?"
        className="zen-input w-full"
        style={inputHeight}
        id="task-title-input"
        autoComplete="off"
      />

      {/* Row 2: Date + Category + Priority + Button */}
      {/* Mobile: stack vertical. sm+: 4 kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3">

        {/* Due date input */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="zen-input w-full cursor-pointer"
          style={inputHeight}
          id="task-due-date-input"
        />

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="zen-input w-full cursor-pointer"
          style={inputHeight}
          id="task-category-select"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Priority dropdown */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="zen-input w-full cursor-pointer"
          style={inputHeight}
          id="task-priority-select"
        >
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Add button */}
        <button
          type="submit"
          className="zen-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-6 whitespace-nowrap"
          style={inputHeight}
          id="add-task-btn"
        >
          <svg
            width="16" height="16"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5"  y1="12" x2="19" y2="12"/>
          </svg>
          <span>Tambah</span>
        </button>

      </div>
    </form>
  );
}