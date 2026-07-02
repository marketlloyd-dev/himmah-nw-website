import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-10 text-center text-ink/50">Memuat...</div>
  if (!session) return <Navigate to="/admin" replace />
  return children
}
