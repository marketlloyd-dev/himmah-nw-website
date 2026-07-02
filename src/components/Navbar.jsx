import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/informasi', label: 'Informasi' },
  { to: '/seputar-himmah', label: 'Seputar HIMMAH' },
  { to: '/galeri', label: 'Galeri' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
      isActive ? 'text-gold' : 'text-cream/80 hover:text-cream'
    } after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-gold after:transition-all ${
      isActive ? 'after:w-full' : 'after:w-0'
    }`

  return (
    <header className="sticky top-0 z-40 bg-emerald-dark border-b border-cream/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-cream text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-emerald-dark font-black">H</span>
          <span>HIMMAH <span className="text-gold">NW</span></span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/seputar-himmah" aria-label="Cari berita" className="text-cream/80 hover:text-cream">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </NavLink>
          <NavLink
            to="/informasi"
            className="rounded-full bg-gold text-emerald-dark text-xs font-bold uppercase tracking-wide px-5 py-2.5 hover:bg-gold-light transition-colors"
          >
            Gabung HIMMAH
          </NavLink>
        </div>

        <button className="md:hidden text-cream p-2" aria-label="Buka menu" onClick={() => setOpen((v) => !v)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-wide ${
                  isActive ? 'bg-gold text-emerald-dark' : 'text-cream/90 hover:bg-cream/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
