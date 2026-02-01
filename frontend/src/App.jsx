import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import MyJobs from './pages/MyJobs'
import MyApplications from './pages/MyApplications'
import Profile from './pages/Profile'
import CreateJob from './pages/CreateJob'
import EditJob from './pages/EditJob'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Jobs />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="my-jobs" element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <MyJobs />
          </ProtectedRoute>
        } />
        <Route path="my-jobs/new" element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="my-jobs/:id/edit" element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <EditJob />
          </ProtectedRoute>
        } />
        <Route path="my-applications" element={
          <ProtectedRoute roles={['job_seeker', 'admin']}>
            <MyApplications />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
