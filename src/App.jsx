import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import ZenBoard from './pages/ZenBoard/ZenBoard';
import Dashboard from './pages/ZenBoard/Dashboard';
import TasksPage from './pages/ZenBoard/TasksPage';
import PomodoroPage from './pages/ZenBoard/PomodoroPage';
import StatsPage from './pages/ZenBoard/StatsPage';

/**
 * App — root routing for Zen Board.
 *
 *  /           → Landing (public)
 *  /login      → Login (public)
 *  /register   → Register (public)
 *  /app        → ZenBoard layout wrapper (protected)
 *    /app/dashboard  → Dashboard
 *    /app/tasks      → Tasks
 *    /app/pomodoro   → Pomodoro
 *    /app/stats      → Statistics
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected app routes */}
            <Route
              path="/app"
              element={<ProtectedRoute><ZenBoard /></ProtectedRoute>}
            >
              <Route index          element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks"     element={<TasksPage />} />
              <Route path="pomodoro"  element={<PomodoroPage />} />
              <Route path="stats"     element={<StatsPage />} />
            </Route>

            {/* Fallback — redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;