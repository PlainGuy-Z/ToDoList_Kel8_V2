const CATEGORIES = ['All', 'Work', 'Study', 'Personal'];
const STATUSES = ['All', 'Active', 'Completed'];
const CATEGORY_LABELS = { All: 'Semua kategori', Work: 'Pekerjaan', Study: 'Belajar', Personal: 'Pribadi' };
const STATUS_LABELS = { All: 'Semua status', Active: 'Aktif', Completed: 'Selesai' };

/**
 * Search bar + category tabs + status tabs for filtering tasks.
 */
export default function TaskFilters({
  search, onSearchChange,
  category, onCategoryChange,
  status, onStatusChange,
  tag, onTagChange,
  tagOptions = []
}) {
  return (
    <div className="space-y-3 zen-fade-in">
      <div className="space-y-1.5">
        <label
          htmlFor="search-input"
          className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
        >
          Cari tugas
        </label>
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
            placeholder="Cari judul tugas..."
            className="zen-input pl-10"
            id="search-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="filter-category-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Filter kategori
          </label>
          <select
            id="filter-category-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="zen-input"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="filter-status-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Filter status
          </label>
          <select
            id="filter-status-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="zen-input"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="filter-tag-select"
            className="text-sm font-medium text-zen-text dark:text-zen-text-dark"
          >
            Filter tag
          </label>
          <select
            id="filter-tag-select"
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            className="zen-input"
          >
            <option value="All">Semua tag</option>
            {tagOptions.map((option) => (
              <option key={option} value={option}>
                #{option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
