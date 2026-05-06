import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Register page — create a new Zen Board account.
 * Design mirrors Login.jsx for visual consistency.
 */

const AVATARS = ['🌿', '🍅', '🌸', '🦋', '🌊', '⭐'];

export default function Register() {
  const [username,  setUsername]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [avatar,    setAvatar]    = useState('🌿');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const { register }      = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate          = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation before calling register
    if (!username.trim()) { setError('Masukkan username Anda.'); return; }
    if (!email.trim())    { setError('Masukkan email Anda.'); return; }
    if (!password)        { setError('Masukkan kata sandi Anda.'); return; }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simulated delay

    const result = register(username.trim(), email.trim(), password, avatar);

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

        {/* Register card */}
        <div className="zen-card py-8 px-6 sm:px-10">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-zen-text dark:text-zen-text-dark"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Buat Akun Baru
            </h1>
            <p className="text-sm text-zen-muted dark:text-zen-muted-dark mt-2">
              Mulai perjalanan produktif Anda bersama Zen Board
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-zen-rose-soft dark:bg-zen-rose/15 border border-zen-rose/30 text-sm text-zen-priority-high text-center font-medium zen-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Avatar picker */}
            <div>
              <label className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-2">
                Pilih Avatar
              </label>
              <div className="flex gap-2 justify-center" id="register-avatar">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`
                      w-10 h-10 rounded-xl text-xl flex items-center justify-center
                      border-2 transition-all duration-200 cursor-pointer
                      ${avatar === av
                        ? 'border-zen-sage bg-zen-sage-soft dark:bg-zen-sage/20 scale-110'
                        : 'border-zen-border dark:border-zen-border-dark hover:border-zen-sage/50'
                      }
                    `}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="register-username"
              >
                Username
              </label>
              <input
                id="register-username"
                type="text"
                className="zen-input"
                placeholder="Pilih username Anda (min. 3 karakter)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                maxLength={20}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="register-email"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className="zen-input"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="register-password"
              >
                Kata Sandi
              </label>
              <input
                id="register-password"
                type="password"
                className="zen-input"
                placeholder="Min. 6 karakter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                className="block text-sm font-medium text-zen-text dark:text-zen-text-dark mb-1.5"
                htmlFor="register-confirm"
              >
                Konfirmasi Kata Sandi
              </label>
              <input
                id="register-confirm"
                type="password"
                className="zen-input"
                placeholder="Ulangi kata sandi"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="zen-btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
              id="register-submit"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>

          </form>

          {/* Link to login */}
          <div className="mt-6 text-center text-sm text-zen-muted dark:text-zen-muted-dark">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-zen-sage font-medium hover:underline"
            >
              Masuk di sini →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}