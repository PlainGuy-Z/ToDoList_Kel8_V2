const CATEGORIES = ['All', 'Work', 'Study', 'Personal'];
const STATUSES = ['All', 'Active', 'Completed'];

/**
 * Search bar + category tabs + status tabs for filtering tasks.
 */
export default function TaskFilters({
  search, onSearchChange,
  category, onCategoryChange,
  status, onStatusChange
}) {
  return (
    <div className="space-y-3 zen-fade-in">
      {/* Search input */}
      <div className="relative">
        <svg
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zen-muted"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="zen-input pl-10"
          id="search-input"
        />
      </div>

      {/* Category + Status tabs */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Category tabs */}
        <div className="flex gap-1 flex-1 bg-zen-surface dark:bg-zen-surface-dark rounded-xl p-1 border border-zen-border dark:border-zen-border-dark">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`
                flex-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer
                transition-all duration-200
                ${category === c
                  ? 'bg-zen-sage text-white shadow-sm'
                  : 'text-zen-muted hover:text-zen-text dark:hover:text-zen-text-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark'
                }
              `}
              id={`filter-cat-${c.toLowerCase()}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-zen-surface dark:bg-zen-surface-dark rounded-xl p-1 border border-zen-border dark:border-zen-border-dark">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer
                transition-all duration-200
                ${status === s
                  ? 'bg-zen-sage text-white shadow-sm'
                  : 'text-zen-muted hover:text-zen-text dark:hover:text-zen-text-dark hover:bg-zen-surface-hover dark:hover:bg-zen-surface-hover-dark'
                }
              `}
              id={`filter-status-${s.toLowerCase()}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
