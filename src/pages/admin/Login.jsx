import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

export default function Login() {
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (session) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) return setError('Email atau kata sandi salah.')
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white border border-emerald/10 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="font-display text-2xl font-bold text-emerald text-center">Admin Login</h1>
        <p className="text-sm text-ink/50 text-center mt-1">HIMMAH NW STMIK Syaikh Zainuddin NW Anjani</p>

        <label className="block text-sm font-medium text-ink/70 mt-6">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
        />

        <label className="block text-sm font-medium text-ink/70 mt-4">Kata Sandi</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 rounded-lg border border-emerald/20 px-3 py-2"
        />

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full mt-6 rounded-full bg-emerald text-cream font-semibold py-2.5 hover:bg-emerald-light disabled:opacity-50"
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
