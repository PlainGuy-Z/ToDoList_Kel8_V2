import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useTasks from '../../hooks/useTasks';
import usePomodoro from '../../hooks/usePomodoro';
import useStats from '../../hooks/useStats';
import DailyStats from '../../components/DailyStats';
import TaskItem from '../../components/TaskItem';
import PomodoroTimer from '../../components/PomodoroTimer';

export default function Dashboard() {
  const { currentUser } = useAuth();
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
  const pomodoro = usePomodoro();
  const stats = useStats(tasks, pomodoro.pomodorosToday);

  // Time-based greeting
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌿' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const dueTodayCount = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    if (Number.isNaN(due.getTime())) return false;
    const today = new Date();
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return dueStart <= todayStart;
  }).length;
  const todaysFocus = activeTasks.slice(0, 5);

  return (
    <div className="space-y-8 pb-8 zen-fade-in">
      {/* 1. Greeting Card */}
      <section className="zen-slide-up" style={{ animationDelay: '0.05s' }}>
        <h1 className="text-3xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
          {greetingInfo.text} {greetingInfo.emoji}
          {currentUser ? `, ${currentUser.username}` : ''}
        </h1>
        <p className="text-zen-muted dark:text-zen-muted-dark mt-1">
          {todayStr}
        </p>
        <p className="mt-2 text-sm font-medium text-zen-sage">
          You have {activeTasks.length} tasks remaining today.
        </p>
      </section>

      {/* 2. Stats Row */}
      <section className="zen-slide-up" style={{ animationDelay: '0.1s' }}>
        <DailyStats 
          completedToday={stats.completedToday}
          remaining={stats.remaining}
          pomodorosToday={stats.pomodorosToday}
          streak={stats.streak}
        />
      </section>

      <section className="zen-slide-up" style={{ animationDelay: '0.12s' }}>
        <div className="zen-card p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zen-text dark:text-zen-text-dark">
              Ringkasan Hari Ini
            </p>
            <p className="text-sm text-zen-muted dark:text-zen-muted-dark mt-0.5">
              {dueTodayCount} tugas perlu perhatian (deadline hari ini atau terlewat).
            </p>
          </div>
          <Link to="/app/today" className="zen-btn-secondary whitespace-nowrap">
            Buka Hari Ini
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. Today's Focus */}
        <section className="zen-slide-up flex flex-col gap-4" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
              Today's Focus
            </h2>
            <Link to="/app/tasks" className="text-sm font-medium text-zen-sage hover:underline">
              View all tasks →
            </Link>
          </div>
          
          <div className="flex flex-col gap-2.5">
            {todaysFocus.length > 0 ? (
              todaysFocus.map(task => (
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
              ))
            ) : (
              <div className="zen-card p-8 text-center text-zen-muted dark:text-zen-muted-dark border-dashed">
                <span className="text-2xl block mb-2">🍃</span>
                <p className="text-sm">All caught up for today. Enjoy your rest.</p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Quick Pomodoro */}
        <section className="zen-slide-up flex flex-col gap-4" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zen-text dark:text-zen-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
              Quick Focus
            </h2>
            <Link to="/app/pomodoro" className="text-sm font-medium text-zen-sage hover:underline">
              Open full timer →
            </Link>
          </div>
          
          <PomodoroTimer 
            mode={pomodoro.mode}
            timeLeft={pomodoro.timeLeft}
            isRunning={pomodoro.isRunning}
            progress={pomodoro.progress}
            pomodorosToday={pomodoro.pomodorosToday}
            start={pomodoro.start}
            pause={pomodoro.pause}
            reset={pomodoro.reset}
          />
        </section>
      </div>
    </div>
  );
}
