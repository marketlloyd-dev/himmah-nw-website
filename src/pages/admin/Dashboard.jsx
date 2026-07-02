import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

const menu = [
  { to: '/admin/dashboard/berita', label: 'Kelola Berita' },
  { to: '/admin/dashboard/pengurus', label: 'Kelola Pengurus' },
  { to: '/admin/dashboard/galeri', label: 'Kelola Galeri' },
  { to: '/admin/dashboard/agenda', label: 'Kelola Agenda' },
]

export default function Dashboard() {
  const { signOut } = useAuth()
  const location = useLocation()
  const isRoot = location.pathname === '/admin/dashboard'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="font-display font-bold text-emerald mb-4">Panel Admin</p>
        {menu.map((m) => (
          <Link
            key={m.to} to={m.to}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              location.pathname.startsWith(m.to) ? 'bg-emerald text-cream' : 'text-ink/70 hover:bg-emerald/10'
            }`}
          >
            {m.label}
          </Link>
        ))}
        <button onClick={signOut} className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 mt-4">
          Keluar
        </button>
      </aside>

      <main>
        {isRoot ? (
          <p className="text-ink/60">Pilih menu di sisi kiri untuk mulai mengelola data website.</p>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}