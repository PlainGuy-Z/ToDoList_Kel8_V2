/**
 * Daily stats — 2x2 grid showing today's productivity metrics.
 */
export default function DailyStats({ completedToday, remaining, pomodorosToday, streak }) {
  const stats = [
    {
      icon: '✅',
      label: 'Selesai Hari Ini',
      value: completedToday,
      color: 'text-zen-sage'
    },
    {
      icon: '📋',
      label: 'Sisa Tugas',
      value: remaining,
      color: 'text-zen-sand'
    },
    {
      icon: '🍅',
      label: 'Pomodoro Hari Ini',
      value: pomodorosToday,
      color: 'text-zen-rose'
    },
    {
      icon: '🔥',
      label: 'Hari Berturut',
      value: streak,
      color: 'text-zen-priority-med'
    }
  ];

  return (
    <div className="zen-card p-5 sm:p-6 zen-slide-up" style={{ animationDelay: '0.25s' }} id="daily-stats">
      <h2 className="text-lg font-semibold text-zen-text dark:text-zen-text-dark mb-4">
        Statistik Hari Ini
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-zen-bg dark:bg-zen-bg-dark rounded-xl p-4 text-center zen-scale-in"
            style={{ animationDelay: `${0.3 + i * 0.08}s` }}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} font-sans`}>
              {stat.value}
            </div>
            <div className="text-xs text-zen-muted dark:text-zen-muted-dark mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
