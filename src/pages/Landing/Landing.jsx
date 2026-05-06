import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Landing page — entry experience for Zen Board.
 * Calm, minimal introduction with CTA to login or open the app.
 */
export default function Landing() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-zen-bg dark:bg-zen-bg-dark text-zen-text dark:text-zen-text-dark font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-zen-bg/80 dark:bg-zen-bg-dark/80 backdrop-blur-md border-b border-zen-border dark:border-zen-border-dark z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪷</span>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Zen Board</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="p-2 rounded-full text-zen-muted hover:bg-zen-surface dark:hover:bg-zen-surface-dark cursor-pointer"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
            {currentUser ? (
              <Link to="/app" className="px-5 py-2 bg-zen-sage hover:brightness-90 text-white rounded-xl font-medium text-sm">
                Buka Zen Board
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2 bg-zen-sage hover:brightness-90 text-white rounded-xl font-medium text-sm">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-8 zen-slide-up">
          <span className="inline-block py-1.5 px-4 rounded-full bg-zen-sage-soft dark:bg-zen-sage/15 text-zen-sage text-sm font-semibold tracking-wide border border-zen-sage/20">
            🌿 Produktivitas yang Tenang
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Ruang Kerja yang
            <br className="hidden sm:block" />
            <span className="text-zen-sage">Tenang & Fokus</span>
          </h1>
          <p className="text-lg sm:text-xl text-zen-muted dark:text-zen-muted-dark max-w-2xl mx-auto leading-relaxed">
            Zen Board membantu Anda mengelola tugas, menjaga fokus dengan Pomodoro, dan melacak kemajuan harian — dalam suasana yang tenang dan minim distraksi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {currentUser ? (
              <Link to="/app" className="w-full sm:w-auto px-8 py-3.5 bg-zen-sage hover:brightness-90 text-white rounded-xl font-medium flex items-center justify-center gap-2 text-lg" style={{ transition: 'all 0.25s ease' }}>
                Buka Zen Board
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            ) : (
              <>
                <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-zen-sage hover:brightness-90 text-white rounded-xl font-medium flex items-center justify-center gap-2 text-lg" style={{ transition: 'all 0.25s ease' }}>
                  Mulai Sekarang
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zen-surface dark:bg-zen-surface-dark border-t border-zen-border dark:border-zen-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Fitur Utama</h2>
            <p className="mt-4 text-lg text-zen-muted dark:text-zen-muted-dark">Semua yang Anda butuhkan untuk hari yang produktif</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '📝', title: 'Manajemen Tugas', desc: 'Buat, edit, dan kelola tugas dengan kategori dan prioritas. Semuanya tersimpan otomatis.' },
              { icon: '🍅', title: 'Pomodoro Timer', desc: 'Teknik fokus 25/5 menit dengan timer visual. Tetap produktif tanpa kelelahan.' },
              { icon: '📊', title: 'Statistik Harian', desc: 'Lacak tugas selesai, sesi fokus, dan streak harian Anda.' },
              { icon: '🔍', title: 'Filter & Pencarian', desc: 'Temukan tugas dengan cepat menggunakan filter kategori, status, dan pencarian.' },
              { icon: '🌙', title: 'Mode Gelap', desc: 'Tampilan nyaman untuk bekerja kapan saja dengan dukungan mode gelap yang lembut.' },
              { icon: '💾', title: 'Offline & Lokal', desc: 'Semua data tersimpan di browser Anda. Tidak perlu server atau koneksi internet.' },
            ].map((f, i) => (
              <div key={i} className="zen-card p-6 zen-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-3xl mb-4 bg-zen-bg dark:bg-zen-bg-dark w-14 h-14 flex items-center justify-center rounded-xl border border-zen-border dark:border-zen-border-dark">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
                <p className="text-zen-muted dark:text-zen-muted-dark leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zen-border dark:border-zen-border-dark bg-zen-bg dark:bg-zen-bg-dark text-center">
        <p className="text-zen-muted dark:text-zen-muted-dark text-sm">
          © 2026 Zen Board. Dibuat untuk produktivitas yang tenang dan fokus. 🪷
        </p>
      </footer>
    </div>
  );
}
