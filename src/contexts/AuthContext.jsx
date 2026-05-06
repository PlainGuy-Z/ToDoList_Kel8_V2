import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — multi-user auth simulation for Zen Board.
 * Stores a user registry in localStorage and validates login credentials.
 * No backend — all data is client-side only.
 */

const AuthContext = createContext(null);

const USERS_KEY   = 'zenboard-users';    // array of all registered users
const SESSION_KEY = 'zenboard-session';  // current logged-in session

/** Read users array from localStorage */
const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Save users array to localStorage */
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/** Read current session from localStorage */
const loadSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) setCurrentUser(session);
    setLoading(false);
  }, []);

  /**
   * register — create a new user account.
   * Returns { success: true } or { success: false, message: string }
   */
  const register = (username, email, password, avatar = '🌿') => {
    // ── Validation ──
    if (!username || username.trim().length < 3) {
      return { success: false, message: 'Username harus minimal 3 karakter.' };
    }
    if (username.trim().length > 20) {
      return { success: false, message: 'Username maksimal 20 karakter.' };
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, message: 'Format email tidak valid.' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Kata sandi harus minimal 6 karakter.' };
    }

    const users = loadUsers();

    // ── Uniqueness check ──
    const usernameTaken = users.some(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (usernameTaken) {
      return { success: false, message: 'Username sudah digunakan.' };
    }

    const emailTaken = users.some(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailTaken) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    // ── Create user ──
    const newUser = {
      id:        Date.now().toString(),
      username:  username.trim(),
      email:     email.trim().toLowerCase(),
      password,  // plain text — simulation only
      avatar,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    // Auto-login after register
    const session = {
      userId:   newUser.id,
      username: newUser.username,
      email:    newUser.email,
      avatar:   newUser.avatar,
      loginAt:  new Date().toISOString(),
    };
    setCurrentUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true };
  };

  /**
   * login — validate credentials against user registry.
   * Falls back to legacy mode (accept any username) if no users registered yet.
   */
  const login = (username, password) => {
    if (!username || username.trim().length < 2) {
      return { success: false, message: 'Masukkan username Anda.' };
    }

    const users = loadUsers();

    // ── Legacy mode: no users registered yet ──
    if (users.length === 0) {
      const session = {
        userId:   'legacy',
        username: username.trim(),
        email:    '',
        avatar:   '🌿',
        loginAt:  new Date().toISOString(),
      };
      setCurrentUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }

    // ── Normal mode: validate credentials ──
    const user = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Kata sandi salah.' };
    }

    const session = {
      userId:   user.id,
      username: user.username,
      email:    user.email,
      avatar:   user.avatar,
      loginAt:  new Date().toISOString(),
    };
    setCurrentUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true };
  };

  /** logout — clear session only, keep user registry intact */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}