import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { PageLoader } from './components/LoadingSpinner'

import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentResults from './pages/student/StudentResults'
import GradebooksList from './pages/teacher/GradebooksList'
import GradebookDetail from './pages/teacher/GradebookDetail'
import UploadGradebook from './pages/teacher/UploadGradebook'
import AddTeacher from './pages/admin/AddTeacher'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'

function RequireAuth({ children }) {
  const { isAuth } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}

function RequireRole({ roles, children }) {
  const { user } = useAuth()
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

function DefaultRedirect() {
  const { user, isAuth } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  if (user?.role === 'student') return <Navigate to="/dashboard" replace />
  return <Navigate to="/gradebooks" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={
        <RequireAuth>
          <RequireRole roles={['student']}>
            <StudentDashboard />
          </RequireRole>
        </RequireAuth>
      } />
      <Route path="/results" element={
        <RequireAuth>
          <RequireRole roles={['student']}>
            <StudentResults />
          </RequireRole>
        </RequireAuth>
      } />

      <Route path="/gradebooks" element={
        <RequireAuth>
          <RequireRole roles={['teacher', 'administrator']}>
            <GradebooksList />
          </RequireRole>
        </RequireAuth>
      } />
      <Route path="/gradebooks/upload" element={
        <RequireAuth>
          <RequireRole roles={['teacher', 'administrator']}>
            <UploadGradebook />
          </RequireRole>
        </RequireAuth>
      } />
      <Route path="/gradebooks/:id" element={
        <RequireAuth>
          <RequireRole roles={['teacher', 'administrator']}>
            <GradebookDetail />
          </RequireRole>
        </RequireAuth>
      } />

      <Route path="/admin/teachers" element={
        <RequireAuth>
          <RequireRole roles={['administrator']}>
            <AddTeacher />
          </RequireRole>
        </RequireAuth>
      } />

      <Route path="/profile" element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      } />
      <Route path="/about" element={
        <RequireAuth>
          <AboutPage />
        </RequireAuth>
      } />

      <Route path="/" element={<DefaultRedirect />} />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
