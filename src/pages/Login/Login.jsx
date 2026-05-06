import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Login page — validates credentials against user registry in AuthContext.
 * Falls back to legacy mode (any username) if no users are registered yet.
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }              = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate               = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Masukkan username Anda.'); return; }
    if (!password.trim()) { setError('Masukkan kata sandi Anda.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    const result = login(username.trim(), password);

    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zen-bg dark:bg-zen-bg-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md zen-slide-up">

        {/* Top bar */}
        <div className="flex justify-between items-center px-4 sm:px-0 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zen-text dark:text-zen-text-dark"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span>🪷</span>
            <span>Zen Board</span>
          </Link>
          <button
            className="p-2 rounded-full text-zen-muted hover:bg-zen-surface dark:hover:bg-zen-surface-dark cursor-pointer transition-colors"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Login card */}
        <div className="zen-card py-8 px-6 sm:px-10">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-zen-text dark:text-zen-text-dark"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Selamat Datang
            </h1>
            <p className="text-sm text-zen-muted dark:text-zen-muted-dark mt-2">
              Masuk untuk membuka ruang kerja Anda
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-zen-rose-soft dark:bg-zen-rose/15 border border-zen-rose/30 text-sm text-zen-priority-high text-center font-medium zen-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="login-user"
              >
                Username
              </label>
              <input
                id="login-user"
                type="text"
                className="zen-input"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="login-pass"
              >
                Kata Sandi
              </label>
              <input
                id="login-pass"
                type="password"
                className="zen-input"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="zen-btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
              id="login-submit"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>

          </form>

          {/* Link to register */}
          <div className="mt-6 text-center text-sm text-zen-muted dark:text-zen-muted-dark">
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="text-zen-sage font-medium hover:underline"
            >
              Daftar sekarang →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}