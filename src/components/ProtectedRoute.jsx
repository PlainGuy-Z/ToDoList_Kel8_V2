import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Simplified route guard — only checks if zenboard-user exists.
 * Redirects to /login if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zen-bg dark:bg-zen-bg-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-zen-border dark:border-zen-border-dark border-t-zen-sage rounded-full animate-spin" />
          <span className="text-zen-muted text-sm font-sans">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}
