import { useMemo } from 'react';
import useTasks from '../../hooks/useTasks';
import usePomodoro from '../../hooks/usePomodoro';
import useStats from '../../hooks/useStats';

export default function StatsPage() {
  const { tasks } = useTasks();
  const { pomodorosToday } = usePomodoro();
  const { streak } = useStats(tasks, pomodorosToday);

  const completedTasks = tasks.filter(t => t.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Best streak (We only have current streak in useStats, but we can simulate "best streak" using current streak if no historical data is stored. For a real app, useStats should track it)
  // We'll read zenboard-streak from localStorage for bestStreak if possible, else just show streak.
  const bestStreak = useMemo(() => {
    try {
      const data = JSON.parse(localStorage.getItem('zenboard-streak') || '{}');
      return Math.max(data.streak || 0, streak);
    } catch {
      return streak;
    }
  }, [streak]);

  // Pomodoros (All-time). We have to sum up from localStorage
  const totalPomodoros = useMemo(() => {
    try {
      const history = JSON.parse(localStorage.getItem('zenboard-pomodoros') || '{}');
      return Object.values(history).reduce((a, b) => a + b, 0);
    } catch {
      return pomodorosToday;
    }
  }, [pomodorosToday]);

  // 7-day bar chart data (Last 7 days)
  const last7Days = useMemo(() => {
    const days = [];
    const maxDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      // Count completions for this day
      const count = tasks.filter(t => t.completed && t.createdAt?.slice(0, 10) === dateStr).length;
      days.push({ label: dayName, count, isToday: i === 0 });
    }
    const maxCount = Math.max(...days.map(d => d.count), 1);
    return days.map(d => ({ ...d, heightPercent: (d.count / maxCount) * 100 }));
  }, [tasks]);

  // By Category
  const categoryStats = useMemo(() => {
    const cats = ['Work', 'Study', 'Personal'];
    return cats.map(c => {
      const catTasks = tasks.filter(t => t.category === c);
      const count = catTasks.length;
      return { label: c, count, percent: totalTasks > 0 ? (count / totalTasks) * 100 : 0 };
    });
  }, [tasks, totalTasks]);

  // By Priority
  const priorityStats = useMemo(() => {
    return {
      High: tasks.filter(t => t.priority === 'High').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      Low: tasks.filter(t => t.priority === 'Low').length,
    };
  }, [tasks]);

  // SVG Circle calculations
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - completionRate / 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 zen-fade-in">
      <section className="zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          Statistics
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          Your all-time productivity overview
        </p>
      </section>

      {/* 1. All-Time Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 zen-slide-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: '📅', label: 'Total Tasks Created', value: totalTasks },
          { icon: '✅', label: 'Total Completed', value: completedTasks.length },
          { icon: '🍅', label: 'Total Pomodoros', value: totalPomodoros },
          { icon: '🔥', label: 'Best Streak', value: `${bestStreak} days` },
        ].map((stat, i) => (
          <div key={i} className="zen-card p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-zen-text dark:text-zen-text-dark">{stat.value}</div>
            <div className="text-xs text-zen-muted dark:text-zen-muted-dark mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. This Week (Bar Chart) */}
        <section className="zen-card p-6 zen-slide-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-lg font-bold text-zen-text dark:text-zen-text-dark mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            This Week's Completions
          </h2>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-zen-border dark:border-zen-border-dark pb-2">
            {last7Days.map((day, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                <div 
                  className="w-full max-w-[40px] bg-zen-sage/30 dark:bg-zen-sage/20 rounded-t-sm relative transition-all group-hover:bg-zen-sage/50"
                  style={{ height: `${Math.max(day.heightPercent, 2)}%` }}
                >
                  <div 
                    className={`absolute bottom-0 w-full rounded-t-sm transition-all ${day.isToday ? 'bg-zen-sage' : 'bg-zen-sage/80'}`}
                    style={{ height: '100%' }}
                  ></div>
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zen-surface dark:bg-zen-surface-dark border border-zen-border dark:border-zen-border-dark text-xs px-2 py-1 rounded shadow-sm transition-opacity">
                    {day.count}
                  </div>
                </div>
                <span className={`text-xs font-medium ${day.isToday ? 'text-zen-text dark:text-zen-text-dark' : 'text-zen-muted dark:text-zen-muted-dark'}`}>
                  {day.label}
                </span>
                {day.isToday && <div className="w-1 h-1 rounded-full bg-zen-sage"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* 5. Completion Rate */}
        <section className="zen-card p-6 flex flex-col items-center justify-center zen-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold text-zen-text dark:text-zen-text-dark mb-4 self-start" style={{ fontFamily: 'var(--font-heading)' }}>
            Completion Rate
          </h2>
          <div className="relative inline-flex items-center justify-center flex-1">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-zen-border dark:text-zen-border-dark" />
              <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-zen-sage)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-zen-text dark:text-zen-text-dark">{completionRate}%</span>
              <span className="text-xs text-zen-muted dark:text-zen-muted-dark mt-1">Completed</span>
            </div>
          </div>
        </section>

        {/* 3. By Category */}
        <section className="zen-card p-6 zen-slide-up" style={{ animationDelay: '0.25s' }}>
          <h2 className="text-lg font-bold text-zen-text dark:text-zen-text-dark mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
            Tasks by Category
          </h2>
          <div className="space-y-4">
            {categoryStats.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-zen-text dark:text-zen-text-dark">{cat.label}</span>
                  <span className="text-zen-muted dark:text-zen-muted-dark">{cat.count} tasks</span>
                </div>
                <div className="h-2.5 w-full bg-zen-border dark:bg-zen-border-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zen-sage rounded-full" 
                    style={{ width: `${cat.percent}%`, transition: 'width 1s ease-out' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. By Priority */}
        <section className="zen-card p-6 zen-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold text-zen-text dark:text-zen-text-dark mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
            Tasks by Priority
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-zen-rose-soft dark:bg-zen-rose/10 px-4 py-2 rounded-full border border-zen-priority-high/20">
              <span className="w-2.5 h-2.5 rounded-full bg-zen-priority-high"></span>
              <span className="text-sm font-medium text-zen-priority-high">High: {priorityStats.High}</span>
            </div>
            <div className="flex items-center gap-2 bg-zen-sand-soft dark:bg-zen-sand/10 px-4 py-2 rounded-full border border-zen-priority-med/20">
              <span className="w-2.5 h-2.5 rounded-full bg-zen-priority-med"></span>
              <span className="text-sm font-medium text-zen-priority-med">Medium: {priorityStats.Medium}</span>
            </div>
            <div className="flex items-center gap-2 bg-zen-sage-soft dark:bg-zen-sage/10 px-4 py-2 rounded-full border border-zen-priority-low/20">
              <span className="w-2.5 h-2.5 rounded-full bg-zen-priority-low"></span>
              <span className="text-sm font-medium text-zen-priority-low">Low: {priorityStats.Low}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
